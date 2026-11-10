import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader, Frown } from "lucide-react";
import RoundRobin, {
    type RoundRobinSnapshot,
} from "../round-robin/RoundRobin";
import SingleEliminationPage from "../single-elimination/SingleElimination";
import { type SingleEliminationSnapshot } from "../../features/single-elimination/hooks/useSingleEliminationTournament";
import DoubleElimination, {
    type DoubleEliminationSnapshot,
} from "../double-elimination/DoubleElimination";
import { loadTournament, type SavedTournament } from "../../lib/tournaments";
import "./shared.css";

type Status = "loading" | "ready" | "notfound" | "error";

const SharedTournament = () => {
    const { id } = useParams<{ id: string }>();
    const [status, setStatus] = useState<Status>("loading");
    const [record, setRecord] = useState<SavedTournament | null>(null);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        let active = true;

        if (!id) {
            setStatus("notfound");
            return;
        }

        setStatus("loading");

        loadTournament(id)
            .then((data) => {
                if (!active) {
                    return;
                }

                if (!data) {
                    setStatus("notfound");
                    return;
                }

                setRecord(data);
                setStatus("ready");
            })
            .catch((error) => {
                if (!active) {
                    return;
                }

                setErrorMsg(
                    error instanceof Error ? error.message : "Could not load."
                );
                setStatus("error");
            });

        return () => {
            active = false;
        };
    }, [id]);

    if (status === "loading") {
        return (
            <div className="shared-screen">
                <Loader className="shared-spin" size={30} strokeWidth={2.3} />
                <p>Loading bracket...</p>
            </div>
        );
    }

    if (status === "notfound" || status === "error") {
        return (
            <div className="shared-screen">
                <Frown size={34} strokeWidth={2.1} />
                <p>
                    {status === "notfound"
                        ? "This bracket could not be found."
                        : errorMsg}
                </p>
                <Link className="shared-home" to="/">
                    Back home
                </Link>
            </div>
        );
    }

    if (record?.format === "round_robin") {
        return <RoundRobin initial={record.state as RoundRobinSnapshot} />;
    }

    if (record?.format === "single_elim") {
        return (
            <SingleEliminationPage
                initial={record.state as SingleEliminationSnapshot}
            />
        );
    }

    if (record?.format === "double_elim") {
        return (
            <DoubleElimination
                initial={record.state as DoubleEliminationSnapshot}
            />
        );
    }

    return (
        <div className="shared-screen">
            <Frown size={34} strokeWidth={2.1} />
            <p>This bracket could not be displayed.</p>
            <Link className="shared-home" to="/">
                Back home
            </Link>
        </div>
    );
};

export default SharedTournament;
