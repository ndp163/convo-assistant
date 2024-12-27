import cssText from 'data-text:~style.css';
import type {
  PlasmoCSConfig,
  PlasmoGetInlineAnchorList,
  PlasmoGetShadowHostId
} from 'plasmo';

export const config: PlasmoCSConfig = {
  matches: ['https://www.chatwork.com/*'],
  all_frames: true
};

export const getStyle = () => {
  const style = document.createElement('style');
  style.textContent = cssText;
  return style;
};

export const getInlineAnchorList: PlasmoGetInlineAnchorList = async () => {
  const anchors = document.querySelectorAll(
    'div[id^="_messageId"][data-deleted="0"] > div:first-child'
  );
  return Array.from(anchors).map((element) => ({
    element,
    insertPosition: 'beforeend'
  }));
};

export const getShadowHostId: PlasmoGetShadowHostId = ({ element }) => {
  return element.parentElement.getAttribute('id');
};

const CustomButton = ({ anchor }) => {
  return (
    <button
      className="tw-w-full"
      onClick={() => {
        let content = '';
        document.querySelectorAll('head > script').forEach((script) => {
          content += script.innerHTML;
        });
        const accessToken = content.match(/ACCESS_TOKEN\s*=\s*'([^']+)'/)[1];
        fetch(
          'https://www.chatwork.com/gateway/load_chat.php?myid=6497550&_v=1.80a&_av=5&ln=en&room_id=359999457&last_chat_id=0&unread_num=0&bookmark=1&file=1',
          {
            headers: {
              accept: 'application/json, text/plain, */*',
              'accept-language': 'en-US,en;q=0.9',
              'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
              priority: 'u=1, i',
              'sec-ch-ua':
                '"Brave";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
              'sec-ch-ua-mobile': '?0',
              'sec-ch-ua-platform': '"Linux"',
              'sec-fetch-dest': 'empty',
              'sec-fetch-mode': 'cors',
              'sec-fetch-site': 'same-origin',
              'sec-gpc': '1'
            },
            referrer: 'https://www.chatwork.com/',
            referrerPolicy: 'strict-origin-when-cross-origin',
            body: `pdata=%7B%22load_file_version%22%3A%222%22%2C%22_t%22%3A%22${accessToken}%22%7D`,
            method: 'POST',
            mode: 'cors',
            credentials: 'include'
          }
        )
          .then((res) => res.json())
          .then((res) => {
            console.log(res);
          });
      }}>
      Get all related messages
    </button>
  );
};

export default CustomButton;
