import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import "./home-link.css";

const HomeLink = () => (
    <Link to="/" className="home-link">
        <ChevronLeft size={16} strokeWidth={2.6} />
        <span>BracketMaker</span>
    </Link>
);

export default HomeLink;
