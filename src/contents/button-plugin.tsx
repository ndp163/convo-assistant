import cssText from 'data-text:~style.css';
import type {
  PlasmoCSConfig,
  PlasmoGetInlineAnchorList,
  PlasmoGetShadowHostId
} from 'plasmo';
import { useRef, useState } from 'react';

import { usePort } from '@plasmohq/messaging/hook';

import {
  OPEN_THREAD_MODAL,
  type ThreadMessage
} from '../background/ports/open-thread-modal';
import { REGEX_PATTERNS } from '../constants';

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

const ButtonPlugin = ({ anchor }) => {
  const openConversationModalPort = usePort(OPEN_THREAD_MODAL);
  const messagesRef = useRef([]);

  const extractAccessToken = () => {
    let content = '';
    document.querySelectorAll('head > script').forEach((script) => {
      content += script.innerHTML;
    });
    const accessToken = content.match(/ACCESS_TOKEN\s*=\s*'([^']+)'/)[1];
    return accessToken;
  };

  const extractRoomId = () => {
    const roomId = window.location.href.match(
      /https:\/\/www.chatwork.com\/#!rid([0-9]+)/
    )[1];
    return roomId;
  };

  const fetchProfile = async (aid: string) => {
    const accessToken = extractAccessToken();

    const res = await fetch(
      `https://www.chatwork.com/gateway/get_detail_account_info.php?_v=1.80a&_av=5&ln=en&aid=${aid}`,
      {
        headers: {
          accept: 'application/json, text/plain, */*',
          'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
          priority: 'u=1, i',
          'sec-ch-ua':
            '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin'
        },
        referrer: 'https://www.chatwork.com/',
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: `pdata=%7B%22_t%22%3A%22${accessToken}%22%7D`,
        method: 'POST',
        mode: 'cors',
        credentials: 'include'
      }
    );
    const data = await res.json();
    return {
      avatar: `https://appdata.chatwork.com/avatar/${data.result.account_dat.av}`,
      name: data.result.account_dat.name,
      aid: data.result.account_dat.aid
    };
  };

  const fetchMessage = async (messageId) => {
    console.log(messagesRef.current.length);
    const accessToken = extractAccessToken();
    const roomId = extractRoomId();
    let message = messagesRef.current.find((m) => m.id === messageId);
    if (!message) {
      const res = await fetch(
        `https://www.chatwork.com/gateway/jump_message.php?myid=6497550&_v=1.80a&_av=5&ln=en&room_id=${roomId}&message_id=${messageId}&bookmark=1&file=1`,
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
            'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
            priority: 'u=1, i',
            'sec-ch-ua':
              '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin'
          },
          referrer: 'https://www.chatwork.com/',
          referrerPolicy: 'strict-origin-when-cross-origin',
          body: `pdata=%7B%22_t%22%3A%22${accessToken}%22%7D`,
          method: 'POST',
          mode: 'cors',
          credentials: 'include'
        }
      );
      const data = await res.json();
      const existingMessage = (message) =>
        messagesRef.current.some((m) => m.id === message.id);
      const newMessages = data.result.chat_list.filter(
        (m) => !existingMessage(m)
      );
      messagesRef.current = [...messagesRef.current, ...newMessages].sort(
        (m1, m2) => m1.tm - m2.tm
      );

      message = data.result.chat_list.find((m) => m.id === messageId);
    }

    return {
      messageId: message.id,
      msg: message.msg,
      reactions: message.reactions,
      aid: message.aid
    };
  };

  const getAllRelatedMessages = async () => {
    const messageId = anchor.element.parentElement.getAttribute('data-mid');

    const message = await fetchMessage(messageId);
    const profile = await fetchProfile(message.aid);

    const payload: ThreadMessage[] = [];
    payload.push({
      avatar: profile.avatar,
      name: profile.name,
      content: message.msg,
      messageId: message.messageId
    });

    let replyMessageMatch = message.msg.match(REGEX_PATTERNS.replyMessage);
    while (replyMessageMatch) {
      const replyToMessageId = replyMessageMatch[1];
      const message = await fetchMessage(replyToMessageId);
      const profile = await fetchProfile(message.aid);
      payload.unshift({
        avatar: profile.avatar,
        name: profile.name,
        content: message.msg,
        messageId: message.messageId
      });
      replyMessageMatch = message.msg.match(REGEX_PATTERNS.replyMessage);
    }

    openConversationModalPort.send(payload);
  };

  return (
    <button className="tw-w-full" onClick={getAllRelatedMessages}>
      Get all related messages
    </button>
  );
};

export default ButtonPlugin;
