import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { fetchPendingSubmissions, updateSubmissionStatus, fetchSponsorChallenges } from '../../utils/api/admin';
import { ButtonPrimary } from '../Buttons';
import '../../css/admin_dashboard_styling/submissionList.css'; // Ensure this file exists

const SubmissionList = () => {
  const [submissions, setSubmissions] = useState([]);
  const [challenges, setChallenges] = useState({});

  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        const fetchedSubmissions = await fetchPendingSubmissions();
        setSubmissions(fetchedSubmissions);
      } catch (error) {
        console.error('Failed to fetch submissions', error);
      }
    };

    const loadChallenges = async () => {
      try {
        const fetchedChallenges = await fetchSponsorChallenges();
        const challengeMap = fetchedChallenges.reduce((acc, challenge) => {
          acc[challenge.id] = challenge;
          return acc;
        }, {});

        setChallenges(challengeMap);
      } catch (error) {
        console.error('Failed to fetch challenges', error);
      }
    };

    loadSubmissions();
    loadChallenges();
  }, []);

  const handleStatusChange = async (submissionId, status) => {
    try {
      await updateSubmissionStatus(submissionId, status);
      setSubmissions(submissions.filter((submission) => submission.id !== submissionId));
    } catch (error) {
      console.error('Failed to update submission status', error);
    }
  };

  return _jsxs("div", { className: "submission-list-container", children: [
    _jsx("h2", { children: "Pending Submissions" }),
    _jsx("ul", { className: "submission-list", children: submissions.map((submission) => {
      const challenge = challenges[submission.challenge_id];

      return _jsxs("li", { className: "submission-item", children: [
        _jsxs("div", { className: "submission-details", children: [
          challenge && _jsxs("div", { className: "challenge-info-admin", children: [
            challenge.brand_name && _jsx("h3", { className: "brand-name-admin", children: challenge.brand_name }),
            challenge.brief && _jsx("p", { className: "brief", children: challenge.brief })
          ]}),
          submission.image_path && _jsx("div", { className: "thumbnail-container", children: 
            _jsx("img", { src: submission.image_path, alt: submission.description, className: "thumbnail" }) 
          }),
          _jsx("p", { className: "submission-description", children: submission.description })
        ]}),
        _jsxs("div", { className: "actions", children: [
          _jsx(ButtonPrimary, { onClick: () => handleStatusChange(submission.id, 'accepted'), text: "Accept" }),
          _jsx(ButtonPrimary, { onClick: () => handleStatusChange(submission.id, 'rejected'), text: "Reject" })
        ]})
      ]}, submission.id);
    })})
  ]});
};

export default SubmissionList;
