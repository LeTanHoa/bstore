// import { assets } from "@/assets/assets";
// import Image from "next/image";
// import React from "react";

// const BlogTableItem = ({
//   authorImg,
//   deleteBlog,
//   mongoId,
//   title,
//   author,
//   date,
//   updateBlog,
//   description,
//   category,
// }) => {
//   return (
//     <tr className="bg-white border-b">
//       <th
//         scope="row"
//         className="items-center gap-3 hidden sm:flex px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
//       >
//         <Image
//           width={40}
//           height={40}
//           src={authorImg ? authorImg : assets.profile_icon}
//         />
//         <p>{author ? author : "No author"}</p>
//       </th>
//       <td className="px-6 py-4">{title ? title : "no title"}</td>
//       <td className="px-6 py-4">{description ? description : "no title"}</td>
//       <td className="px-6 py-4">{category ? category : "no title"}</td>

//       <td className="px-6 py-4">{date}</td>
//       <td
//         className="px-6 py-4 cursor-pointer"
//         onClick={() => deleteBlog(mongoId)}
//       >
//         X
//       </td>
//       <td
//         className="px-6 py-4 cursor-pointer text-blue-500"
//         onClick={() => updateBlog(mongoId)} // Trigger update action
//       >
//         Update
//       </td>
//     </tr>
//   );
// };

// export default BlogTableItem;
