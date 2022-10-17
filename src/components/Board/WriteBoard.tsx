// import React, { useEffect, useState } from 'react';
// import styled from 'styled-components';
// import Editor from 'components/Board/Editor.js';
// import oc from 'open-color';

// const Container = styled.div`
//   width: 100%;
//   background: white;
//   border: 1px solid black;
//   border-radius: 10px;
//   padding: 0px 20px;
//   display: flex;
//   flex-direction: column;
//   margin-bottom: 20px;

//   form {
//     width: 100%;
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//   }

//   .quill {
//     width: 100%;
//     height: 200px;
//     margin-bottom: 50px;
//   }
// `;

// const Div = styled.div`
//   margin: 20px 0px;
//   width: 100%;

//   input[type='text'] {
//     width: 100%;
//     border-radius: 5px;
//     font-size: 18px;
//     padding: 5px;
//   }

//   input[type='file'] {
//     margin-top: 10px;
//     width: 100%;
//   }
// `;

// const Button = styled.button`
//   background: ${oc.indigo[1]};
//   border: none;
//   border-radius: 5px;
//   margin-bottom: 20px;
//   width: 200px;
//   font-size: 18px;
//   font-weight: 550;
//   padding: 10px 0px;
//   cursor: pointer;
// `;

// const Error = styled.div`
//   color: red;
//   font-size: 17px;
//   margin-bottom: 20px;
// `;

// const SaveFiles = styled.div`
//   display: flex;
// `;

// const WriteBoard = ({
//   close,
//   postPosts,
//   user,
//   id,
//   postData,
//   deleteFile,
//   type,
// }) => {
//   const [post, setPost] = useState({
//     title: '',
//     body: '', // text이지만 html
//     category: '',
//     delFiles: {
//       org: [],
//       save: [],
//     },
//   });
//   const [err, setErr] = useState(null);
//   const [files, setFiles] = useState(undefined);
//   const [postCates, setPostCates] = useState();
//   const { userType } = user;

//   useEffect(() => {
//     if (!postData) return;
//     const { title, body, category } = postData;
//     setPost({
//       ...post,
//       title,
//       body,
//       category,
//     });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [postData]);

//   useEffect(() => {
//     setPost({
//       ...post,
//       category: type,
//     });
//   }, [type]);

//   useEffect(() => {
//     if (userType === 'top') {
//       setPostCates({
//         data: '자료 게시판',
//         etc: '자유 게시판',
//       });
//     } else if (userType === 'admin') {
//       setPostCates({
//         notice: '공지사항',
//         etc: '자유 게시판',
//       });
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [userType]);

//   const onChangeValue = (e) => {
//     const { name, value } = e.target;
//     setErr(null);

//     setPost({
//       ...post,
//       [name]: value,
//     });
//   };

//   const onChangeFiles = (e) => {
//     setFiles(e.target.files);
//     console.log(files, e.target.files);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     let formData = new FormData();
//     for (let key in files) {
//       formData.append('file', files[key]);
//     }
//     formData.append('data', JSON.stringify(post));
//     let resArr = await postPosts(id, formData, postData);
//     if (resArr[0]) {
//       alert('게시물을 업로드하였습니다 !');
//       close();
//     } else {
//       setErr(resArr[1]);
//     }
//   };

//   const onClickDelFiles = (i) => {
//     let tmpOrg = post.delFiles.org.slice();
//     let tmpSave = post.delFiles.save.slice();
//     tmpOrg.push(postData.orgFileName[i]);
//     tmpSave.push(postData.saveFileName[i]);
//     setPost({
//       ...post,
//       delFiles: {
//         org: tmpOrg,
//         save: tmpSave,
//       },
//     });
//     deleteFile(i);
//   };

//   return (
//     <Container>
//       <form onSubmit={handleSubmit}>
//         <Div>
//           <input
//             type="text"
//             id="title"
//             name="title"
//             placeholder="제목을 입력해주세요."
//             value={post.title}
//             onChange={onChangeValue}
//           />
//         </Div>
//         {/* {postCates && type && (
//           <Div>
//             업로드 게시판
//             <select
//               name="category"
//               onChange={onChangeValue}
//               defaultValue={postCates[type]}
//             >
//               <option value="default" disabled>
//                 게시판을 선택해주세요.
//               </option>
//               {Object.keys(postCates).map((e) => {
//                 return (
//                   <option key={e} value={e}>
//                     {postCates[e]}
//                   </option>
//                 );
//               })}
//             </select>
//           </Div>
//         )} */}
//         <Editor value={post.body} onChange={onChangeValue} />
//         <Div>
//           <label htmlFor="files">첨부 파일</label>
//           <br />
//           <input
//             id="files"
//             type="file"
//             accept=".xlsx, .xls"
//             multiple
//             onChange={onChangeFiles}
//           />
//           {postData &&
//             postData.orgFileName.map((e, i) => (
//               <SaveFiles key={e}>
//                 <div key={e}>{e}</div>
//                 <input
//                   type="button"
//                   value="X"
//                   onClick={() => onClickDelFiles(i)}
//                 />
//               </SaveFiles>
//             ))}
//         </Div>
//         {err && <Error>{err}</Error>}
//         <Button type="submit">저장하기</Button>
//       </form>
//     </Container>
//   );
// };

// export default WriteBoard;

// // 0813
// // 게시글 수정 완료 후 처리 해야함
