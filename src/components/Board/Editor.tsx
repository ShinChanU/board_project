// import React from 'react';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

// const toolbarOptions = [
//   [{ header: [1, 2, 3, false] }],
//   ['bold', 'italic', 'underline', 'strike'],
//   ['blockquote'],
//   [{ list: 'ordered' }, { list: 'bullet' }],
//   [{ color: [] }, { background: [] }],
//   [{ align: [] }],
// ];

// const formats = [
//   'header',
//   'font',
//   'size',
//   'bold',
//   'italic',
//   'underline',
//   'strike',
//   'align',
//   'blockquote',
//   'list',
//   'bullet',
//   'indent',
//   'background',
//   'color',
//   'width',
// ];

// const modules = {
//   toolbar: {
//     container: toolbarOptions,
//   },
// };

// const Editor = ({ value, onChange }) => {
//   return (
//     <ReactQuill
//       theme="snow"
//       modules={modules}
//       formats={formats}
//       value={value}
//       onChange={(e) => onChange({ target: { value: e, name: 'body' } })}
//     />
//   );
// };

// export default Editor;
