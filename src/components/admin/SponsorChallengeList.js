import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { fetchSponsorChallenges, createSponsorChallenge, deleteSponsorChallenge, uploadBrandLogo, fetchBrandLogoUrl } from '../../utils/api/admin';
import { ButtonLong, ButtonPrimary } from '../../components/Buttons';
import { ImageOff } from 'lucide-react';
import '../../css/admin_dashboard_styling/sponsorCallengeCard.css';
const SponsorChallengeList = () => {
    const [challenges, setChallenges] = useState([]);
    const [newChallenge, setNewChallenge] = useState({
        title: '',
        brief: '',
        brand_name: '',
        submission_deadline: '',
    });
    const [brandLogoFile, setBrandLogoFile] = useState(null);
    const [brandLogoPreview, setBrandLogoPreview] = useState(null);
    const [errorMessages, setErrorMessages] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);
    // State to hold the URLs of the brand logos
    const [brandLogoUrls, setBrandLogoUrls] = useState({});
    // Fetch sponsor challenges on mount
    useEffect(() => {
        const loadChallenges = async () => {
            const fetchedChallenges = await fetchSponsorChallenges();
            setChallenges(fetchedChallenges);
            // Fetch the brand logo URLs for each challenge
            const logoUrls = {};
            for (const challenge of fetchedChallenges) {
                // Make sure to check if brand_logo_id exists and only then fetch its URL
                if (challenge.brand_logo_id) {
                    const url = await fetchBrandLogoUrl(challenge.brand_logo_id);
                    logoUrls[challenge.id] = url;
                }
            }
            setBrandLogoUrls(logoUrls);
        };
        loadChallenges();
    }, []);
    // Handle Create Sponsor Challenge
    const handleCreateChallenge = async () => {
        try {
            setErrorMessages({});
            let uploadedLogo = null;
            if (brandLogoFile) {
                uploadedLogo = await uploadBrandLogo(brandLogoFile); // Upload the brand logo
            }
            const challengeData = {
                title: newChallenge.title,
                brief: newChallenge.brief,
                brand_name: newChallenge.brand_name,
                submission_deadline: newChallenge.submission_deadline,
                brand_logo_id: uploadedLogo?.id || "", // Ensure brand_logo_id is always defined
            };
            const challenge = await createSponsorChallenge(challengeData);
            setChallenges((prevChallenges) => [...prevChallenges, challenge]);
            // Reset the form
            setNewChallenge({ title: '', brief: '', brand_name: '', submission_deadline: '' });
            setBrandLogoFile(null);
            setBrandLogoPreview(null);
        }
        catch (error) {
            setErrorMessage('Error creating sponsor challenge');
            console.error('Error creating sponsor challenge:', error);
        }
    };
    // Handle Delete Sponsor Challenge
    const handleDeleteChallenge = async (challengeId) => {
        try {
            await deleteSponsorChallenge(challengeId);
            setChallenges((prevChallenges) => prevChallenges.filter((challenge) => challenge.id !== challengeId));
        }
        catch (error) {
            console.error('Error deleting sponsor challenge:', error);
        }
    };
    // Handle brand logo change
    const handleBrandLogoChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setBrandLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setBrandLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    return (_jsxs("div", { className: 'admin-challenges-header', children: [_jsx("h2", { children: "Sponsor Challenges" }), _jsxs("div", { className: "admin-form", children: [_jsx("h3", { className: 'challenge-section-header', children: " Create new challenge " }), _jsxs("div", { className: "input-field", children: [_jsx("label", { htmlFor: "title", children: "Title:" }), _jsx("input", { id: "title", className: `admin-input ${errorMessages.title ? 'has-error' : ''}`, type: "text", placeholder: "Title", value: newChallenge.title, onChange: (e) => setNewChallenge({ ...newChallenge, title: e.target.value }) }), errorMessages.title && _jsx("small", { children: errorMessages.title })] }), _jsxs("div", { className: "input-field", children: [_jsx("label", { htmlFor: "brief", children: "Brief:" }), _jsx("textarea", { id: "brief", className: `admin-input ${errorMessages.brief ? 'has-error' : ''}`, placeholder: "Brief", value: newChallenge.brief, onChange: (e) => setNewChallenge({ ...newChallenge, brief: e.target.value }) }), errorMessages.brief && _jsx("small", { children: errorMessages.brief })] }), _jsxs("div", { className: "input-field", children: [_jsx("label", { htmlFor: "brand_name", children: "Brand Name:" }), _jsx("input", { id: "brand_name", className: `admin-input ${errorMessages.brand_name ? 'has-error' : ''}`, type: "text", placeholder: "Brand Name", value: newChallenge.brand_name, onChange: (e) => setNewChallenge({ ...newChallenge, brand_name: e.target.value }) }), errorMessages.brand_name && _jsx("small", { children: errorMessages.brand_name })] }), _jsxs("div", { className: "input-field", children: [_jsx("label", { htmlFor: "submission_deadline", children: "Submission Deadline:" }), _jsx("input", { id: "submission_deadline", className: `admin-input ${errorMessages.submission_deadline ? 'has-error' : ''}`, type: "datetime-local", placeholder: "Submission Deadline", value: newChallenge.submission_deadline, onChange: (e) => setNewChallenge({ ...newChallenge, submission_deadline: e.target.value }) }), errorMessages.submission_deadline && _jsx("small", { children: errorMessages.submission_deadline })] }), _jsxs("div", { className: "input-field", children: [_jsx("label", { htmlFor: "brand_logo", children: "Brand Logo:" }), _jsx("input", { id: "brand_logo", type: "file", accept: "image/*", onChange: handleBrandLogoChange }), brandLogoPreview && _jsx("img", { src: brandLogoPreview, alt: "Brand Logo Preview", width: 100 })] }), _jsx(ButtonLong, { text: "Create Challenge", onClick: handleCreateChallenge }), errorMessage && _jsx("p", { className: "backend-error", children: errorMessage })] }), _jsxs("ul", { className: "sponsor-challenge-card-list", children: [_jsx("h3", { className: 'challenge-section-header', children: " Current challenges " }), challenges.length > 0 ? (challenges.map((challenge) => (_jsx("li", { children: _jsxs("div", { className: "sponsor-challenge-card", children: [challenge.brand_logo_id ? (_jsx("div", { className: "brand-logo-container-admin", children: _jsx("img", { src: brandLogoUrls[challenge.id] || '', alt: `${challenge.brand_name} logo` }) })) : (_jsx("div", { className: "brand-logo-container-admin", children: _jsx(ImageOff, { color: "#131313", size: 70 }) })), _jsxs("div", { className: 'challenge-info', children: [_jsx("h4", { children: challenge.brand_name }), _jsx("strong", { children: challenge.title }), " -", challenge.brief] }), _jsxs("div", { className: 'challenge-deadline', children: [_jsx("strong", { children: "Submission Deadline:" }), " ", _jsx("br", {}), " ", challenge.submission_deadline] }), _jsx("div", { className: 'challenge-actions', children: _jsx(ButtonPrimary, { text: "Delete", onClick: () => handleDeleteChallenge(challenge.id) }) })] }) }, challenge.id)))) : (_jsx("li", { children: "No sponsor challenges found" }))] })] }));
};
export default SponsorChallengeList;
