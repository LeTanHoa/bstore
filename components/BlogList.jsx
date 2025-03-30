// import React, { useEffect, useState } from "react";
// import BlogItem from "./BlogItem";
// import axios from "axios";

// const BlogList = () => {
//   const [menu, setMenu] = useState("All");
//   const [blogs, setBlogs] = useState([]);

//   useEffect(() => {
//     const fetchDataBlogs = async () => {
//       const res = await axios.get("/api/blog");
//       setBlogs(res.data.blogs);
//     };
//     fetchDataBlogs();
//   }, []);
//   return (
//     <div>
//       <div className="flex justify-center gap-6 my-10">
//         <button
//           onClick={() => setMenu("All")}
//           className={
//             menu === "All" ? "bg-black text-white py-1 px-4 rounded-sm" : ""
//           }
//         >
//           All
//         </button>
//         <button
//           onClick={() => setMenu("Technology")}
//           className={
//             menu === "Technology"
//               ? "bg-black text-white py-1 px-4 rounded-sm"
//               : ""
//           }
//         >
//           Technology
//         </button>
//         <button
//           onClick={() => setMenu("Startup")}
//           className={
//             menu === "Startup" ? "bg-black text-white py-1 px-4 rounded-sm" : ""
//           }
//         >
//           Startup
//         </button>
//         <button
//           onClick={() => setMenu("Lifestyle")}
//           className={
//             menu === "Lifestyle"
//               ? "bg-black text-white py-1 px-4 rounded-sm"
//               : ""
//           }
//         >
//           LifeStyle
//         </button>
//       </div>
//       <div className="flex flex-wrap justify-around gap-1 gap-y-10 mb-16 xl:mx-24">
//         {blogs
//           ?.filter((item) => (menu === "All" ? true : item.category === menu))
//           .map((blog, index) => (
//             <BlogItem
//               id={blog._id}
//               key={index}
//               title={blog.title}
//               description={blog.description}
//               category={blog.category}
//               image={blog.image}
//             />
//           ))}
//       </div>
//     </div>
//   );
// };

// export default BlogList;
