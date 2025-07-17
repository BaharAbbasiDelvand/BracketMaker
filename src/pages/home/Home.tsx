import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";


export function Home() {
    return (
        <>
            <h1>Rank whatever!</h1>

            <Link to="/round-robin">
                <Button variant="danger" className="m-2">
                    Round-Robin
                </Button>
            </Link>
            <Link to="/single-elimination">
                <Button variant="info" className="m-2">
                    Single-Elimination Bracket
                </Button>
            </Link>
            <Link to="/double-elimination">
                <Button variant="secondary" className="m-2">
                    Double-Elimination Bracket
                </Button>
            </Link>
        </>
    );
}
