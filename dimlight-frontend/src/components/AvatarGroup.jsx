import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const users = [
  { id: 1, name: "Bhrigu Kumar Deka", image: "../../public/avatar-1.png" },
  { id: 2, name: "Ghushit Kumar Chutia", image: "../../public/avatar-2.png" },
  { id: 3, name: "RudraPratap Singh Jatt", image: "../../public/avatar-3.png" },
];

export default function AvatarGroup() {
  return (
    <div className="mx-auto flex flex-col items-center justify-center space-x-4">
      <div className="text-text text-xs font-bold uppercase tracking-wider mb-6">
        Designed, Developed & Deployed by
      </div>
      <div className="flex items-center">
        {users.map((user, index) => (
          <AvatarItem key={user.id} user={user} index={index} />
        ))}
      </div>
    </div>
  );
}

const AvatarItem = ({ user, index }) => {
  const [isHovered, setHovered] = useState(false);

  return (
    <motion.div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        marginLeft: index === 0 ? 0 : "-12px", 
        zIndex: isHovered ? 50 : index, 
      }}
      animate={{ scale: isHovered ? 1.15 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Image */}
      <div className="relative w-16 h-16 rounded-full bg-text overflow-hidden cursor-pointer shadow-sm border-2 border-background">
        <img
          src={user.image}
          alt={user.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap"
          >
            <div className="bg-text text-background text-[10px] font-bold px-3 py-1.5 rounded-full shadow-xl">
              {user.name}
            </div>
            {/* Pointer */}
            <div className="w-2 h-2 bg-text rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};