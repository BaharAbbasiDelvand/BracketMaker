import React, { useState } from "react";
import { Share2, Check, Copy, TriangleAlert, Loader } from "lucide-react";
import { saveTournament, type NewTournament } from "../../lib/tournaments";
import { isSupabaseConfigured } from "../../lib/supabaseClient";
import { addMyBracket } from "../../lib/myBrackets";
import "./save-share-bar.css";

type Status = "idle" | "saving" | "saved" | "error";

type Props = {
    canSave: boolean;
    getPayload: () => NewTournament | null;
};

const SaveShareBar: React.FC<Props> = ({ canSave, getPayload }) => {
    const [status, setStatus] = useState<Status>("idle");
    const [shareUrl, setShareUrl] = useState("");
    const [copied, setCopied] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleSave = async () => {
        const payload = getPayload();

        if (!payload) {
            return;
        }

        setStatus("saving");
        setErrorMsg("");

        try {
            const id = await saveTournament(payload);
            const url = `${window.location.origin}/t/${id}`;
            window.history.replaceState(null, "", `/t/${id}`);

            const teams = Array.isArray(payload.teams)
                ? (payload.teams as unknown[]).map((team) => String(team))
                : [];

            addMyBracket({
                id,
                format: payload.format,
                teamsCount: teams.length,
                preview: teams.filter((team) => team.trim() !== "").slice(0, 3),
                savedAt: Date.now(),
            });

            setShareUrl(url);
            setStatus("saved");

            try {
                await navigator.clipboard.writeText(url);
                setCopied(true);
            } catch {
                setCopied(false);
            }
        } catch (error) {
            setErrorMsg(
                error instanceof Error ? error.message : "Could not save."
            );
            setStatus("error");
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
        } catch {
            setCopied(false);
        }
    };

    if (!isSupabaseConfigured) {
        return null;
    }

    if (status === "saved") {
        return (
            <div className="share-bar share-bar--done">
                <div className="share-bar__link">
                    <input
                        type="text"
                        readOnly
                        value={shareUrl}
                        onFocus={(e) => e.currentTarget.select()}
                    />
                    <button
                        type="button"
                        className="share-bar__copy"
                        onClick={handleCopy}
                    >
                        {copied ? (
                            <Check size={15} strokeWidth={2.4} />
                        ) : (
                            <Copy size={15} strokeWidth={2.2} />
                        )}
                        {copied ? "Copied" : "Copy"}
                    </button>
                </div>
                <span className="share-bar__hint">
                    Anyone with this link can view this bracket.
                </span>
            </div>
        );
    }

    return (
        <div className="share-bar">
            <button
                type="button"
                className="share-bar__save"
                onClick={handleSave}
                disabled={!canSave || status === "saving"}
            >
                {status === "saving" ? (
                    <Loader size={16} strokeWidth={2.3} className="share-bar__spin" />
                ) : (
                    <Share2 size={16} strokeWidth={2.3} />
                )}
                {status === "saving" ? "Saving..." : "Save & Share"}
            </button>
            {status === "error" && (
                <span className="share-bar__error">
                    <TriangleAlert size={14} strokeWidth={2.3} />
                    {errorMsg}
                </span>
            )}
        </div>
    );
};

export default SaveShareBar;
