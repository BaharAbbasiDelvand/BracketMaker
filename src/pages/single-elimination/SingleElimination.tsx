import React from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import BracketView from "../../features/single-elimination/components/BracketView";
import { useSingleEliminationTournament } from "../../features/single-elimination/hooks/useSingleEliminationTournament";
import "./single-elimination.css";

export default function SingleEliminationPage() {
    const {
        step,
        teamCount,
        teamNames,
        rounds,
        champion,
        allowedTeamCounts,
        handleTeamCountChange,
        handleTeamNameChange,
        handleGenerate,
        handleBack,
        handlePickWinner,
    } = useSingleEliminationTournament();

    if (step === "setup") {
        return (
            <Container className="py-4">
                <h1 className="mb-4">Single Elimination</h1>

                <Card className="shadow-sm">
                    <Card.Body>
                        <Row className="g-3 mb-4">
                            <Col md={4}>
                                <Form.Group controlId="teamCount">
                                    <Form.Label>Number of teams</Form.Label>
                                    <Form.Select
                                        value={teamCount}
                                        onChange={(e) =>
                                            handleTeamCountChange(
                                                Number(e.target.value)
                                            )
                                        }
                                    >
                                        {allowedTeamCounts.map((count) => (
                                            <option key={count} value={count}>
                                                {count}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="g-3">
                            {teamNames.map((teamName, index) => (
                                <Col xs={12} md={6} lg={4} key={index}>
                                    <Form.Group
                                        controlId={`team-${index + 1}`}
                                    >
                                        <Form.Label>
                                            Team {index + 1}
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={teamName}
                                            onChange={(e) =>
                                                handleTeamNameChange(
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </Form.Group>
                                </Col>
                            ))}
                        </Row>

                        <div className="mt-4 d-flex gap-2">
                            <Button onClick={handleGenerate}>
                                Generate Shuffled Bracket
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    return (
        <Container fluid className="py-4 px-3">
            <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
                <div>
                    <h1 className="mb-1">{teamCount} Team Single Elimination</h1>
                    <div className="text-muted">
                        Teams were shuffled randomly before being placed into
                        the bracket.
                    </div>
                </div>

                <Button variant="secondary" onClick={handleBack}>
                    Back to Setup
                </Button>
            </div>

            {rounds.length > 0 && (
                <BracketView
                    rounds={rounds}
                    champion={champion}
                    onPick={handlePickWinner}
                />
            )}
        </Container>
    );
}