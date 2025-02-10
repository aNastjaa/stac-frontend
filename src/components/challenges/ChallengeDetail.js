import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { getChallengeDetails, submitWork, getSubmissions } from "../../utils/api/challenges";
import { fetchBrandLogoUrl } from "../../utils/api/admin";
import { ImagePlus, Info } from "lucide-react";
import { ButtonLong, ButtonCTA, ButtonPrimary } from "../../components/Buttons";
import SubmissionCard from "../../components/challenges/SubmissionCard";
import FullScreenSubmission from "../../components/challenges/FullScreenSubmission";
import "../../css/challenges/challengeDetail.css";
import { getCsrfTokenFromCookie } from "../../utils/api";
import FullScreenProUpgrade from "../FullScreenProUpgrade";
const ChallengeDetail = () => {
    const { challengeId } = useParams();
    const [challenge, setChallenge] = useState(null);
    const [brandLogoUrl, setBrandLogoUrl] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [description, setDescription] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);
    const [showInfo, setShowInfo] = useState(false);
    const [submissions, setSubmissions] = useState([]);
    const [visibleSubmissions, setVisibleSubmissions] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const fileInputRef = useRef(null);
    const [role, setRole] = useState("");
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    useEffect(() => {
        const storedUser = localStorage.getItem("auth_user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setRole(parsedUser.role_name || ""); // Ensure role is properly set
            }
            catch (error) {
                console.error("Error parsing auth_user from localStorage:", error);
            }
        }
    }, []);
    console.log("User role:", role);
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!challengeId)
                    return;
                const challengeData = await getChallengeDetails(challengeId);
                setChallenge(challengeData);
                if (challengeData.brand_logo_id) {
                    const logoUrl = await fetchBrandLogoUrl(challengeData.brand_logo_id);
                    setBrandLogoUrl(logoUrl);
                }
                // Fetch all submissions and filter accepted ones
                const submissionsData = await getSubmissions(challengeId);
                const acceptedSubmissions = submissionsData.filter((submission) => submission.status === "accepted");
                setSubmissions(acceptedSubmissions);
                setVisibleSubmissions(acceptedSubmissions.slice(0, 6));
                setHasMore(acceptedSubmissions.length > 6);
            }
            catch (error) {
                console.error("Error fetching challenge details:", error);
                setErrorMessage("Failed to load challenge details. Please try again later.");
            }
        };
        fetchData();
    }, [challengeId]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!imageFile) {
            setErrorMessage("Please upload an image before submitting.");
            return;
        }
        try {
            const csrfToken = getCsrfTokenFromCookie();
            if (!csrfToken) {
                throw new Error("CSRF token is missing");
            }
            const formData = new FormData();
            formData.append("image", imageFile);
            formData.append("description", description);
            const newSubmission = await submitWork(challengeId ?? 'default-challenge-id', formData, csrfToken);
            setShowForm(false);
            setImageFile(null);
            setDescription("");
            setErrorMessage(null);
            // Add new submission and re-filter
            setSubmissions((prevState) => {
                const updatedSubmissions = [newSubmission, ...prevState];
                const acceptedSubmissions = updatedSubmissions.filter((submission) => submission.status === "accepted");
                setVisibleSubmissions(acceptedSubmissions.slice(0, 6));
                setHasMore(acceptedSubmissions.length > 6);
                return acceptedSubmissions;
            });
            alert("Work submitted successfully!");
        }
        catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            }
            else {
                setErrorMessage("Failed to submit work");
            }
            console.error("Error submitting work:", error);
        }
    };
    const handleIconClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const loadMoreSubmissions = () => {
        const nextBatch = submissions.slice(visibleSubmissions.length, visibleSubmissions.length + 5);
        setVisibleSubmissions((prev) => [...prev, ...nextBatch]);
        setHasMore(submissions.length > visibleSubmissions.length + nextBatch.length);
    };
    const handleSubmissionClick = (submission) => {
        setSelectedSubmission(submission);
    };
    const closeFullScreenSubmission = () => {
        setSelectedSubmission(null);
    };
    const handleSubmissionDeleted = (submissionId) => {
        console.log(`Submission with ID ${submissionId} deleted`);
        setSubmissions((prevState) => {
            const newState = prevState.filter(submission => submission.id !== submissionId);
            console.log("Updated submissions:", newState);
            return newState;
        });
    };
    if (!challenge)
        return _jsx("p", { children: "Loading challenge details..." });
    return (_jsxs("div", { className: "challenge-details", children: [_jsxs("div", { className: "challenge-detail-container", children: [_jsxs("section", { className: "hero-section-challenge-detail", children: [brandLogoUrl && _jsx("img", { src: brandLogoUrl, alt: challenge.brand_name, className: "brand-logo" }), _jsx("h1", { className: "brand-name-challenge-detail", children: challenge.brand_name }), _jsx("h2", { className: "challenge-detail-title", children: challenge.title }), _jsx("p", { className: "challenge-detail-brief", children: challenge.brief }), _jsxs("p", { className: "deadline", children: ["Deadline: ", challenge.submission_deadline] }), role !== "basic" && _jsx(ButtonLong, { onClick: () => setShowForm(true), text: "Submit" })] }), showForm && (_jsx("div", { className: "modal-overlay", children: _jsxs("div", { className: "modal-content", children: [_jsx("button", { className: "close-button", onClick: () => setShowForm(false), children: "\u00D7" }), _jsx("h2", { children: "Submit Your Artwork" }), _jsxs("form", { onSubmit: handleSubmit, className: "artwork-submit-form", children: [_jsxs("div", { className: "form-group artwork-image", children: [_jsx("label", { className: "form-label", onClick: handleIconClick, children: _jsx(ImagePlus, { size: 50, color: "#131313", className: "image-icon" }) }), _jsxs("p", { className: "icon-explanation", children: ["Click on the icon ", _jsx("br", {}), "to choose a photo"] }), _jsx("input", { ref: fileInputRef, type: "file", className: "form-input", onChange: (e) => setImageFile(e.target.files ? e.target.files[0] : null), style: { display: "none" }, accept: "image/*" }), imageFile && _jsx("img", { src: URL.createObjectURL(imageFile), alt: "Preview", className: "image-preview" })] }), _jsxs("div", { className: "form-group artwork-description", children: [_jsx("label", { className: "form-label", children: "Description:" }), _jsxs("div", { className: "textarea-container", children: [_jsx("textarea", { value: description, onChange: (e) => setDescription(e.target.value), placeholder: "Enter artwork description", className: "form-detail-textarea" }), _jsx("button", { className: "info-button", onClick: (e) => {
                                                                e.preventDefault();
                                                                setShowInfo(true);
                                                            }, "aria-label": "Show information", children: _jsx(Info, { size: 20, color: "#888" }) })] }), errorMessage && _jsx("p", { className: "error-message", children: errorMessage })] }), _jsx("div", { className: "form-group", children: _jsx(ButtonCTA, { text: "Submit Artwork", link: "#", onClick: handleSubmit }) })] })] }) })), showInfo && (_jsx("div", { className: "info-modal", children: _jsxs("div", { className: "info-content", children: [_jsx("h3", { children: "Important Information" }), _jsx("p", { children: "When you submit an artwork, it will be reviewed to ensure it matches the current theme. After approval, your artwork will appear on Artwork page for everyone to admire!" }), _jsx("button", { onClick: () => setShowInfo(false), className: "close-info-button", children: "Close" })] }) })), _jsxs("section", { className: "submissions-gallery", children: [_jsx("h2", { children: "Submissions Gallery" }), visibleSubmissions.length > 0 ? (_jsx("div", { className: "submissions-container", children: visibleSubmissions.map((submission) => (_jsx("div", { onClick: () => handleSubmissionClick(submission), children: _jsx(SubmissionCard, { submission: submission, challenge: challenge.title, onSubmissionDeleted: handleSubmissionDeleted }) }, submission.id))) })) : (_jsx("p", { className: "no-submissions-message", children: role === "pro" ? (_jsxs(_Fragment, { children: ["There are no submissions yet. ", _jsx("br", {}), " Be the first to showcase your creativity and steal the spotlight! \uD83D\uDE80\uD83C\uDFA8"] })) : (_jsxs(_Fragment, { children: ["There are no submissions yet. ", _jsx("br", {}), "But you can", " ", _jsx("span", { className: "upgrade-link", onClick: () => setShowUpgradeModal(true), children: _jsx("strong", { children: "upgrade to Pro" }) }), " ", "and be the first to share your creativity! \uD83C\uDF1F"] })) })), hasMore && _jsx(ButtonPrimary, { onClick: loadMoreSubmissions, text: "Load More" })] }), showUpgradeModal && _jsx(FullScreenProUpgrade, { onClose: () => setShowUpgradeModal(false) })] }), selectedSubmission && (_jsx(FullScreenSubmission, { submission: selectedSubmission, challengeName: challenge.title, votesCount: selectedSubmission.votes_count, onClose: closeFullScreenSubmission, onSubmissionDeleted: handleSubmissionDeleted }))] }));
};
export default ChallengeDetail;
