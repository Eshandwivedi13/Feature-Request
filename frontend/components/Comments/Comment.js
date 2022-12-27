import React, { useState } from "react";
import SingleComment from "./SingleComment";

const Comment = ({ comments }) => {
  // const [values, setValues] = useState({
  //   content: "",
  // });
  // const { editing, content } = values;

  const mapComments = () => {
    return comments.map((c, i) => {
      return (
        <div key={i}>
          <SingleComment c={c} />
        </div>
      );
    });
  };

  return (
    <div className="my-4 mx-2">
      <p>{comments.length} comments</p>
      <hr />
      {mapComments()}
    </div>
  );
};

export default Comment;

// const ab = () =>{
//     <div className="d-flex">
//     <div>
//       <img
//         src="https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA14dHoX.img?w=612&h=408&m=6&x=297&y=139&s=355&d=355"
//         alt="abc"
//         height="50vh"
//         width="50vw"
//         style={{ borderRadius: "50%" }}
//       />
//     </div>
//     <div className="mx-3 w-100 ">
//       <p>
//         {editing ? (
//           <Input
//             type="text"
//             placeholder="Edit your Comment"
//             value={comments.postedBy.username}
//             // onChange={(e) => console.log(e.target.value)}
//           />
//         ) : (
//           comments.postedBy
//         )}
//       </p>
//       <div className="d-inline-flex justify-content-between w-100">
//         <p className="lead">
//           {" "}
//           Posted by {""}
//           <Link href={`/user/${comments.postedBy}`}>
//             {comments.postedBy} {""}
//           </Link>
//           on {new Date(comments.createdAt).toDateString()}
//         </p>
//         <div>
//           {isAuth() &&
//           comments.postedBy &&
//           isAuth()._id === data.postedBy._id &&
//           !editing ? (
//             <React.Fragment>
//               <Button
//                 color="primary"
//                 size="sm"
//                 onClick={() => {
//                   setValues({ ...values, editing: !editing });
//                 }}
//               >
//                 Edit Comment
//               </Button>

//               {/* baad mei change this thing */}
//               <Button
//                 color="danger ml-3"
//                 size="sm"
//                 // onClick={() => {
//                 //   deleteConfirm();
//                 // }}
//               >
//                 Delete Comment
//               </Button>
//             </React.Fragment>
//           ) : (
//             <React.Fragment>
//               <Button color="primary" size="sm">
//                 Submit
//               </Button>
//               <Button
//                 color="danger ml-3"
//                 size="sm"
//                 onClick={() => {
//                   setValues({ ...values, editing: !editing });
//                 }}
//               >
//                 Cancel
//               </Button>
//             </React.Fragment>
//           )}
//         </div>
//       </div>
//     </div>
//   </div>
// }

// const faltu = () =>{
//            {/* <Media>
//             <Media left href="#" className="">
//               <Media
//                 object
//                 className="mr-2"
//                 src="https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA14dHoX.img?w=612&h=408&m=6&x=297&y=139&s=355&d=355"
//                 height="50vh"
//                 width="50vw"
//                 style={{ borderRadius: "50%" }}
//                 alt="Generic placeholder image"
//               />
//             </Media> */}
//           {/* <Media body>
//               <Media heading>Nested media heading</Media>
//               Cras sit amet nibh libero, in gravaaaaaaaaa Donec lacinia congue
//               felis in faucibus.
//             </Media>
//           </Media> */}
// }
