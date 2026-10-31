/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaInbox, FaArrowRight, FaRedo } from "react-icons/fa";

const EmptyState = ({
  icon: Icon = FaInbox,
  badge = "No Records",
  title = "No Data Found",
  description = "There are currently no items to display here.",
  actionText,
  actionLink,
  actionOnClick,
  actionIcon: ActionIcon = FaArrowRight,
  secondaryText,
  secondaryLink,
  secondaryOnClick,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`bg-white rounded-3xl p-10 md:p-14 text-center border border-gray-100 shadow-xs max-w-xl mx-auto my-6 ${className}`}
    >
      {/* Icon with glowing backdrop */}
      <div className="relative mx-auto w-20 h-20 mb-5 flex items-center justify-center">
        <div className="absolute inset-0 rounded-3xl bg-amber-100/60 blur-md transform scale-90"></div>
        <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-100 border border-amber-200/60 text-[#FBAE02] flex items-center justify-center text-3xl shadow-sm">
          <Icon />
        </div>
      </div>

      {/* Badge */}
      {badge && (
        <span className="inline-block px-3 py-1 text-[11px] font-black uppercase tracking-wider text-amber-900 bg-amber-100/80 rounded-full mb-2 border border-amber-200/50">
          {badge}
        </span>
      )}

      {/* Title & Description */}
      <h3 className="text-xl font-black text-gray-900 tracking-tight mb-2">
        {title}
      </h3>
      <p className="text-xs text-gray-500 leading-relaxed max-w-md mx-auto mb-6">
        {description}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {actionText && (
          actionLink ? (
            <Link
              to={actionLink}
              className="inline-flex items-center gap-2 bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white font-extrabold text-xs uppercase px-5 py-3 rounded-2xl transition duration-200 shadow-sm"
            >
              <span>{actionText}</span>
              {ActionIcon && <ActionIcon className="text-xs" />}
            </Link>
          ) : (
            <button
              onClick={actionOnClick}
              className="inline-flex items-center gap-2 bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white font-extrabold text-xs uppercase px-5 py-3 rounded-2xl transition duration-200 shadow-sm"
            >
              <span>{actionText}</span>
              {ActionIcon && <ActionIcon className="text-xs" />}
            </button>
          )
        )}

        {secondaryText && (
          secondaryLink ? (
            <Link
              to={secondaryLink}
              className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs uppercase px-4 py-3 rounded-2xl transition duration-200"
            >
              <span>{secondaryText}</span>
            </Link>
          ) : (
            <button
              onClick={secondaryOnClick}
              className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs uppercase px-4 py-3 rounded-2xl transition duration-200"
            >
              <FaRedo className="text-[10px]" />
              <span>{secondaryText}</span>
            </button>
          )
        )}
      </div>
    </motion.div>
  );
};

export default EmptyState;
