import { GoShareAndroid } from "react-icons/go";
import { BsWhatsapp } from "react-icons/bs";
import { IoMdShare } from "react-icons/io";
import { FaInstagram, FaFacebookF, FaXTwitter } from "react-icons/fa6";

const SharePopup = ({ url, title = "Share", onClose }) => {

  // ✅ COPY LINK (safe for HTTP / HTTPS)
  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = url;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      onClose();
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  // ✅ WhatsApp
  const handleWhatsAppShare = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(url)}`,
      "_blank"
    );
    onClose();
  };

  // ✅ Facebook
  const handleFacebookShare = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank"
    );
    onClose();
  };

  // ✅ Twitter / X
  const handleTwitterShare = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      "_blank"
    );
    onClose();
  };

  // ⚠️ Instagram (no direct web share → copy link)
  const handleInstagramShare = () => {
    handleCopyLink();
    alert("Link copied! Paste it in Instagram.");
  };

  // ✅ Native mobile share
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: "Check out this product",
          url,
        });
        onClose();
      } catch (err) {
        console.error("Native share failed:", err);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg py-4 w-72 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h5 className="font-semibold pb-4 px-5">Share Link</h5>

        <div className="flex justify-around text-xl">
          <button onClick={handleCopyLink} className="text-gray-600">
            <IoMdShare />
          </button>

          <button onClick={handleWhatsAppShare} className="text-green-500">
            <BsWhatsapp />
          </button>

          <button onClick={handleInstagramShare} className="text-pink-500">
            <FaInstagram />
          </button>

          <button onClick={handleFacebookShare} className="text-blue-600">
            <FaFacebookF />
          </button>

          <button onClick={handleTwitterShare} className="text-black">
            <FaXTwitter />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SharePopup;
