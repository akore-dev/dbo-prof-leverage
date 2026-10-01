import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import DiagnosticLanding from "./component/DiagnosticLanding";
import Wheel from "./component/Wheel";
import Email from "./component/Email";
import ReferralEntry from "./component/ReferralEntry";
import ReferralProgress from "./component/ReferralProgress";
import RouteMetadata from "./component/RouteMetadata";
import Admin from "./component/Admin";
import NotFound from "./component/NotFound";

function App() {
  return (
    <Router>
      <RouteMetadata />
      <div className="App">
        <Routes>
          <Route path="/" element={<DiagnosticLanding />} />
          <Route path="/assessment" element={<Wheel />} />
          <Route path="/wheel" element={<Wheel />} />
          <Route path="/result" element={<Email />} />
          <Route path="/results" element={<Email />} />
          <Route path="/email" element={<Email />} />
          <Route path="/s/:code" element={<ReferralEntry />} />
          <Route path="/referrer" element={<ReferralEntry />} />
          <Route path="/progress" element={<ReferralProgress />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;