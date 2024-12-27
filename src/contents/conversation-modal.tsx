// import { ClothingItem } from '@components/detailModal/clothingItem';
// import { ImpactInfoCard } from '@components/detailModal/impactInfoCard';
// import { ImpactItem } from '@components/detailModal/impactItem';
// import { HighlightedNumberText } from '@components/highlightItemText';
// import { Spinner } from '@components/spinner';
// import { Tabs } from '@components/tabs';
// import modalBanner from 'data-base64:~_assets/banners/modal-banner.png';
// import logo from 'data-base64:~_assets/logo-colored.svg';
// import cssText from 'data-text:~_styles/modal.css';
// import { PlasmoCSConfig, PlasmoGetInlineAnchor } from 'plasmo';
// import React from 'react';

// import { usePort } from '@plasmohq/messaging/hook';

// export const config: PlasmoCSConfig = {
//   matches: ['https://www.chatwork.com/*'],
//   all_frames: true
// };

// export const getStyle = () => {
//   const style = document.createElement('style');
//   style.textContent = cssText;
//   return style;
// };

// export const getInlineAnchor: PlasmoGetInlineAnchor = () =>
//   document.querySelector('body');

// const ProductDetailModal = () => {
//   const [show, setShow] = React.useState(false);
//   const [tabIndex, setTabIndex] = React.useState(0);
//   const { data: alternatives, isLoading, isError } = useGetAllAlternatives();
//   const [alternativeKeywords, setAlternativeKeywords] = React.useState<
//     string[]
//   >([]);

//   return (
//     <div
//       className="tw-translate-x-full tw-modal-overlay tw-z-50 tw-h-screen tw-transition-transform tw-transform tw-duration-500"
//       onClick={() => {
//         setShow(false);
//       }}>
//       <div
//         className="modal-content z-50 max-h-screen overflow-y-auto shadow-xl rounded-tl-xl rounded-tr-xl"
//         onClick={(e) => {
//           e.preventDefault();
//           e.stopPropagation();
//         }}>
//         <div className="flex justify-between items-center p-8 pb-0">
//           <button
//             className="text-md"
//             onClick={() =>
//               window.open('https://streads-landing-sljp.vercel.app/', '_blank')
//             }>
//             <img src={logo} alt="Streads Logo" />
//           </button>

//           <button
//             type="button"
//             className="rounded-full p-2 hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
//             onClick={() => setShow(false)}>
//             <XMarkIcon className="h-8 w-8" aria-hidden="true" />
//           </button>
//         </div>

//         <img
//           src={modalBanner}
//           alt="Modal Banner"
//           width={'500px'}
//           className="pt-4"
//         />
//       </div>
//     </div>
//   );
// };
// export default withQueryClient(ProductDetailModal);
