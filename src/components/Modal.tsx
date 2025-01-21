import React from "react";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  imageFile: File | null;
  setImageFile: React.Dispatch<React.SetStateAction<File | null>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
}

const Modal = ({
  show,
  onClose,
  onSubmit,
  imageFile,
  setImageFile,
  description,
  setDescription,
}: ModalProps) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Submit Your Artwork</h2>
        <form onSubmit={onSubmit}>
          <div className="artwork-image">
            <label>Image:</label>
            <input
              type="file"
              onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
            />
            {imageFile && <img src={URL.createObjectURL(imageFile)} alt="Preview" style={{ maxWidth: '200px' }} />}
          </div>

          <div className="artwork-description">
            <label>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter artwork description"
            />
          </div>

          <button type="submit" className="submit-button">Submit Artwork</button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
