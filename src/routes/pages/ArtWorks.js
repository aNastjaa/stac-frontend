import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { fetchCurrentTheme, submitArtwork, fetchArtworks } from '../../utils/api/artworks';
import { ButtonCTA, ButtonLong, ButtonPrimary } from '../../components/Buttons';
import ArtworkCard from '../../components/artworks/ArtworkCard';
import { ImagePlus, Info } from 'lucide-react';
import "../../css/artworks/artworkPage.css";
import { getCsrfTokenFromCookie } from '../../utils/api';
import DotLoader from '../../components/DotLoader';
import FullScreenPost from '../../components/artworks/FullScreenPost';
import LastMonthCarousel from '../../components/carousels/LastMonthCarousel';
import SuccessModal from '../../components/SuccessModal';
const ArtWorks = () => {
    const [currentTheme, setCurrentTheme] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [description, setDescription] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [allArtworks, setAllArtworks] = useState([]);
    const [visibleArtworks, setVisibleArtworks] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [selectedArtwork, setSelectedArtwork] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const fileInputRef = useRef(null);
    useEffect(() => {
        const getTheme = async () => {
            try {
                const theme = await fetchCurrentTheme();
                setCurrentTheme(theme);
            }
            catch (error) {
                console.error('Error fetching theme:', error);
            }
        };
        const loadArtworks = async () => {
            setLoading(true);
            try {
                const artworks = await fetchArtworks();
                setAllArtworks(artworks);
                setVisibleArtworks(artworks.slice(0, 9));
                setHasMore(artworks.length > 9);
            }
            catch (error) {
                console.error('Error fetching artworks:', error);
            }
            finally {
                setLoading(false);
            }
        };
        getTheme();
        loadArtworks();
    }, []);
    const handlePostClick = (artwork) => {
        setSelectedArtwork(artwork);
    };
    const closeFullScreenPost = () => {
        setSelectedArtwork(null);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(null);
        setSuccessMessage(null);
        if (!imageFile || !description) {
            setErrorMessage('Image and Description are required');
            return;
        }
        try {
            const csrfToken = getCsrfTokenFromCookie();
            if (!csrfToken) {
                throw new Error('CSRF token is missing');
            }
            const formData = new FormData();
            formData.append('image', imageFile);
            formData.append('description', description);
            if (currentTheme) {
                formData.append('theme_id', currentTheme.id);
            }
            const { message, post } = await submitArtwork(formData, csrfToken);
            if (post) {
                setAllArtworks((prevState) => [...prevState, post]);
                setVisibleArtworks((prevState) => [...prevState, post]);
            }
            setSuccessMessage(message);
            window.alert(message);
            setShowForm(false);
        }
        catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            }
            else {
                setErrorMessage('An unexpected error occurred');
            }
        }
    };
    const handleIconClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const loadMoreArtworks = () => {
        setLoading(true);
        const nextBatch = allArtworks.slice(visibleArtworks.length, visibleArtworks.length + 9);
        setVisibleArtworks((prev) => [...prev, ...nextBatch]);
        setHasMore(allArtworks.length > visibleArtworks.length + nextBatch.length);
        setLoading(false);
    };
    const handlePostDeleted = (postId) => {
        console.log(`Post with ID ${postId} deleted`);
        setAllArtworks((prevState) => {
            const newState = prevState.filter(post => post.id !== postId);
            console.log('Updated allArtworks:', newState);
            return newState;
        });
        setVisibleArtworks((prevState) => {
            const newState = prevState.filter(post => post.id !== postId);
            console.log('Updated visibleArtworks:', newState);
            return newState;
        });
    };
    return (_jsxs("div", { className: "artwork-page", children: [selectedArtwork && (_jsx(FullScreenPost, { post: {
                    id: selectedArtwork.id,
                    imageUrl: selectedArtwork.image_path,
                    username: selectedArtwork.user.username,
                    avatarUrl: selectedArtwork.user.avatar_url,
                    userId: selectedArtwork.user.id,
                    themeName: selectedArtwork.theme.theme_name,
                    likes_count: selectedArtwork.likes,
                    comments_count: (selectedArtwork.comments?.length ?? 0),
                    createdAt: selectedArtwork.created_at,
                    description: selectedArtwork.description,
                }, onClose: closeFullScreenPost, onPostDeleted: handlePostDeleted })), _jsxs("section", { className: "artwork-submit-section", children: [_jsxs("h1", { className: "current-theme-title", children: ["Current Theme: ", _jsx("br", {}), " ", _jsx("span", { className: "current-theme-name", children: currentTheme ? currentTheme.theme_name : 'Loading...' })] }), _jsxs("p", { className: "current-theme-description", children: ["This month\u2019s theme is all about the color yellow! ", _jsx("br", {}), _jsx("br", {}), " Whether it\u2019s in a painting, a photo, or even 3D art, we want to see how you bring yellow to life in your own creative way. ", _jsx("br", {}), _jsx("br", {}), "Show us yellow in its many forms\u2014bright, bold, and beautiful. Let your imagination run wild!"] }), _jsx(ButtonLong, { onClick: () => setShowForm(true), text: "Submit" })] }), showForm && (_jsx("div", { className: "modal-overlay", children: _jsxs("div", { className: "modal-content", children: [_jsx("button", { className: "close-button", onClick: () => setShowForm(false), children: "\u00D7" }), _jsx("h2", { children: "Submit Your Artwork" }), _jsxs("form", { onSubmit: handleSubmit, className: "artwork-submit-form", children: [_jsxs("div", { className: "form-group artwork-image", children: [_jsx("label", { className: "form-label", onClick: handleIconClick, children: _jsx(ImagePlus, { size: 50, color: "#131313", className: "image-icon" }) }), _jsxs("p", { className: "icon-explanation", children: ["Click on the icon ", _jsx("br", {}), "to choose a photo"] }), _jsx("input", { ref: fileInputRef, type: "file", id: "file-input", className: "form-input", onChange: (e) => setImageFile(e.target.files ? e.target.files[0] : null), style: { display: 'none' } }), imageFile && _jsx("img", { src: URL.createObjectURL(imageFile), alt: "Preview", className: "image-preview" })] }), _jsxs("div", { className: "form-group-artwork-description", children: [_jsx("label", { className: "form-label", children: "Add description:" }), _jsxs("div", { className: "artwork-textarea-container", children: [_jsx("textarea", { value: description, onChange: (e) => setDescription(e.target.value), placeholder: "Enter artwork description", className: "form-textarea" }), _jsx("button", { className: "info-button", onClick: (e) => {
                                                        e.preventDefault();
                                                        setShowInfo(true);
                                                    }, "aria-label": "Show information", children: _jsx(Info, { size: 20, color: "#888" }) })] })] }), errorMessage && _jsx("p", { className: "error-message", children: errorMessage }), successMessage && _jsx(SuccessModal, { message: successMessage }), _jsx("div", { className: "form-group", children: _jsx(ButtonCTA, { text: "Submit Artwork", link: "#", onClick: handleSubmit }) }), showInfo && (_jsx("div", { className: "info-modal", children: _jsxs("div", { className: "info-modal-content", children: [_jsx("button", { className: "info-close-button", onClick: () => setShowInfo(false), children: "\u00D7" }), _jsx("p", { children: "When you submit an artwork, it will be reviewed to ensure it matches the current theme. After approval, your artwork will appear on Artwork page for everyone to admire!" })] }) }))] })] }) })), _jsxs("section", { className: "this-month-artworks", children: [_jsx("h2", { className: "section-title", children: "This Month's Artworks" }), _jsxs("div", { className: "artworks-gallery", children: [loading ? (_jsx(DotLoader, {})) : (visibleArtworks.length === 0 && _jsx("p", { className: "no-artworks", children: "No artworks available." })), visibleArtworks
                                .filter((artwork) => artwork.status === 'accepted')
                                .map((artwork) => (_jsx(ArtworkCard, { artwork: artwork, onClick: () => handlePostClick(artwork), userId: artwork.user.id }, artwork.id)))] }), hasMore && !loading && (_jsx(ButtonPrimary, { onClick: loadMoreArtworks, text: "Load More" }))] }), _jsxs("section", { className: "top-artworks-last-month", children: [_jsx("h2", { className: "section-title", children: "Top Artworks from Last Month" }), _jsx("h3", { className: "theme-title", children: "\"Beyond the Horizon\"" }), _jsx("p", { className: "theme-description", children: "Capture the beauty and mystery of the horizon and what lies beyond it. Whether it\u2019s a stunning landscape, a dream of what\u2019s ahead, or a creative interpretation of what the horizon represents, this theme is your chance to showcase how you see and imagine it." }), _jsx(LastMonthCarousel, {})] })] }));
};
export default ArtWorks;
