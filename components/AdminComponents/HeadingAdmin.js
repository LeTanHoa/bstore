import React from "react";

const HeadingAdmin = ({ title }) => {
  return (
    <div className="text-[20px] px-3 md:text-2xl mb-4 bg-[#323232] rounded-xl text-white h-[75px] flex items-center justify-center uppercase font-bold  text-center">
      {title}
    </div>
  );
};

export default HeadingAdmin;
