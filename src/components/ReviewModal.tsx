import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { reviewService } from '../services';
import { Product } from '../types';
import { X, Star, ShieldCheck } from 'lucide-react';

interface ReviewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  product,
  isOpen,
  onClose,
  onReviewSubmitted,
}) => {
  const { user, addToast } = useShop();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [name, setName] = useState<string>(
    user ? `${user.firstName} ${user.lastName}` : ''
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      addToast('Please provide your review feedback', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewService.createReview({
        productId: product.id,
        productName: product.name,
        userId: user?.id || 'guest-' + Date.now(),
        userName: name.trim() || 'Verified Customer',
        rating,
        comment: comment.trim(),
        verifiedPurchase: true,
      });

      addToast('Review submitted! It will appear once approved by admin moderation.', 'success');
      onReviewSubmitted();
      onClose();
    } catch (err) {
      addToast('Could not submit review', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="review-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="review-modal-content"
        className="relative w-full max-w-lg bg-[#181818] border border-[#333333] p-6 md:p-8 shadow-2xl text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#333333] pb-4 mb-6">
          <div>
            <h2 className="text-lg font-bold uppercase tracking-wider font-['Syne',sans-serif]">
              WRITE A REVIEW
            </h2>
            <p className="text-xs text-[#B3B3B3] line-clamp-1 mt-0.5">
              {product.name}
            </p>
          </div>
          <button
            id="btn-close-review-modal"
            onClick={onClose}
            className="p-1 text-[#808080] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Verified purchase status */}
          <div className="flex items-center gap-2 px-3 py-2 bg-[#202020] border border-[#333333] text-xs text-[#B3B3B3]">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Verified Customer Purchase Review</span>
          </div>

          {/* Star Rating Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#B3B3B3] mb-2">
              Overall Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-[#808080] hover:text-white transition-colors"
                  aria-label={`Rate ${star} star`}
                >
                  <Star
                    className={`w-6 h-6 transition-all ${
                      (hoverRating || rating) >= star
                        ? 'fill-white text-white'
                        : 'text-[#444444]'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-white ml-2">
                {hoverRating || rating} / 5
              </span>
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#B3B3B3] mb-1.5">
              Your Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ahmed K."
              className="w-full bg-[#111111] border border-[#333333] px-3.5 py-2.5 text-xs text-white placeholder-[#808080] focus:border-white focus:outline-none transition-colors"
            />
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#B3B3B3] mb-1.5">
              Your Experience
            </label>
            <textarea
              rows={4}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How does the fabric drape? How is the sizing and collar fit?"
              className="w-full bg-[#111111] border border-[#333333] p-3.5 text-xs text-white placeholder-[#808080] focus:border-white focus:outline-none transition-colors"
            />
          </div>

          {/* Notice */}
          <p className="text-[11px] text-[#808080] leading-relaxed">
            All reviews undergo editorial moderation in accordance with AVIRO community quality standards before public display.
          </p>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-[#333333]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#808080] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-white hover:bg-[#E5E5E5] text-black text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
