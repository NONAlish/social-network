const InfoModal = ({ chat }) => {
  if (!chat) return null;

  return (
    <div className="info-modal bg-white rounded-lg p-6 max-w-xs mx-auto shadow-lg text-center transform transition-transform duration-300 ease-in-out hover:translate-y-0 -translate-y-2">
      <img
        src={chat.user.avatar}
        alt={chat.user.name}
        className="w-[100px] h-[100px] rounded-full mx-auto mb-4"
      />
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        {chat.user.name}
      </h2>
      <p className="text-sm text-gray-600 mb-2">
        Last message: {chat.lastMessage.text}
      </p>
      <p className="text-xs text-gray-400">
        Last seen: {chat.lastMessage.date}
      </p>
    </div>
  );
};

export default InfoModal;
