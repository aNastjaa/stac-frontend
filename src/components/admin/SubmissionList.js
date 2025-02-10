import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { fetchPendingSubmissions, updateSubmissionStatus } from '../../utils/api/admin';
import { ButtonPrimary } from '../Buttons';
import '../../css/admin_dashboard_styling/submissionList.css'; // Make sure to create this file
const SubmissionList = () => {
    const [submissions, setSubmissions] = useState([]);
    useEffect(() => {
        const loadSubmissions = async () => {
            try {
                const fetchedSubmissions = await fetchPendingSubmissions();
                setSubmissions(fetchedSubmissions);
            }
            catch (error) {
                console.error('Failed to fetch submissions', error);
            }
        };
        loadSubmissions();
    }, []);
    const handleStatusChange = async (submissionId, status) => {
        try {
            await updateSubmissionStatus(submissionId, status); // Ensure types align
            setSubmissions(submissions.filter((submission) => submission.id !== submissionId)); // Remove updated submission
        }
        catch (error) {
            console.error('Failed to update submission status', error);
        }
    };
    return (_jsxs("div", { className: 'submission-list-container', children: [_jsx("h2", { children: "Pending Submissions" }), _jsx("ul", { className: "submission-list", children: submissions.map((submission) => (_jsxs("li", { className: "submission-item", children: [_jsxs("div", { className: "submission-details", children: [_jsx("p", { className: "submission-username", children: submission.user.username }), submission.image_path && (_jsx("div", { className: "thumbnail-container", children: _jsx("img", { src: submission.image_path, alt: submission.description, className: "thumbnail" }) })), _jsx("p", { className: "submission-description", children: submission.description })] }), _jsxs("div", { className: "actions", children: [_jsx(ButtonPrimary, { onClick: () => handleStatusChange(submission.id, 'accepted'), text: "Accept" }), _jsx(ButtonPrimary, { onClick: () => handleStatusChange(submission.id, 'rejected'), text: "Reject" })] })] }, submission.id))) })] }));
};
export default SubmissionList;
