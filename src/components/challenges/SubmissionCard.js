import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import VoteButton from '../../components/challenges/VoteButton';
import FullScreenSubmission from '../../components/challenges/FullScreenSubmission';
import '../../css/challenges/submissionCard.css';
const SubmissionCard = ({ submission, isPending, onClick, challenge, onSubmissionDeleted }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [username, setUsername] = useState(null);
    const [votesCount, setVotesCount] = useState(submission.votes ? Math.max(submission.votes.length, 1) : 1);
    const [isFullscreen, setIsFullscreen] = useState(false);
    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setUsername(submission.user.username);
            setIsLoading(false);
        }, 1000);
    }, [submission.user.username]);
    const handleClick = (e) => {
        if (isPending) {
            e.preventDefault();
        }
        else if (onClick) {
            onClick();
        }
    };
    const handleOpenFullscreen = () => {
        setIsFullscreen(true);
    };
    const handleCloseFullscreen = () => {
        setIsFullscreen(false);
    };
    const handleSubmissionDeleted = (submissionId) => {
        console.log(`Submission with ID ${submissionId} deleted`);
        onSubmissionDeleted(submissionId);
    };
    return (_jsxs("div", { className: `submission-card ${isPending ? 'blurred' : ''}`, onClick: handleClick, children: [_jsx("div", { className: "submission-card-header", children: isLoading ? _jsx("span", { children: "Loading..." }) : `@${username}` }), _jsx("div", { className: "submission-image-container", onClick: handleOpenFullscreen, children: _jsx("img", { src: submission.image_path, alt: "Submission", className: "submission-image", loading: "lazy" }) }), _jsx("div", { className: "submission-card-footer", children: !isPending && (_jsxs("div", { className: "icon-container", children: [_jsx(VoteButton, { challengeId: submission.challenge_id, submissionId: submission.id, setVotesCount: setVotesCount }), _jsxs("span", { className: "icon-count", children: [votesCount, " votes"] })] })) }), isPending && _jsx("div", { className: "approval-overlay", children: "Waiting to be approved" }), isFullscreen && (_jsx("div", { className: "fullscreen-modal-overlay", onClick: handleCloseFullscreen, children: _jsx("div", { className: "fullscreen-modal-content", onClick: (e) => e.stopPropagation(), children: _jsx(FullScreenSubmission, { submission: submission, onClose: handleCloseFullscreen, challengeName: challenge, votesCount: votesCount, onSubmissionDeleted: handleSubmissionDeleted }) }) }))] }));
};
export default SubmissionCard;
