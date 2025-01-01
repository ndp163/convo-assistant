import cssText from 'data-text:~style.css';
import type { PlasmoCSConfig, PlasmoGetOverlayAnchor } from 'plasmo';
import { useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';

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

export const getOverlayAnchor: PlasmoGetOverlayAnchor = async () =>
  document.querySelector('#root');

const ConversationModal = () => {
  const [show, setShow] = useState(false);
  const openConversationModalPort = usePort(OPEN_THREAD_MODAL);

  const renderWithLineBreaks = (text) => {
    return text.split('\n').map((line, index) => {
      if (REGEX_PATTERNS.replyMessage.test(line)) {
        return (
          <span className="tw-text-xs tw-text-cyan-700" key={index}>
            @{line.replace(line.match(REGEX_PATTERNS.replyMessage)[0], '')}
            {index < text.split('\n').length - 1 && <br />}
          </span>
        );
      }
      if (REGEX_PATTERNS.toMessage.test(line)) {
        return (
          <span className="tw-text-xs tw-text-cyan-700" key={index}>
            @{line.replace(line.match(REGEX_PATTERNS.toMessage)[0], '')}
            {index < text.split('\n').length - 1 && <br />}
          </span>
        );
      }
      return (
        <span className="tw-text-sm" key={index}>
          {line}
          {index < text.split('\n').length - 1 && <br />}
        </span>
      );
    });
  };

  const convertMessageToElement = (message: ThreadMessage) => {
    const content = message.content;
    const parts = content.split(REGEX_PATTERNS.quoteMessageSplit);

    return (
      <div>
        {parts.map((part) => {
          if (REGEX_PATTERNS.quoteMessageContent.test(part)) {
            const content = part.match(REGEX_PATTERNS.quoteMessageContent)[1];
            return (
              <blockquote className="tw-p-2 tw-border-s-4 tw-border-gray-300 tw-bg-gray-50 tw-text-xs">
                {renderWithLineBreaks(content)}
              </blockquote>
            );
          }
          return renderWithLineBreaks(part.trim());
        })}
      </div>
    );
  };

  useEffect(() => {
    openConversationModalPort.listen(async (payload) => {
      if (payload === null) {
        return;
      }
      setShow(true);
    });
  }, []);
  return (
    show && (
      <div
        className="tw-fixed tw-bg-black tw-bg-opacity-40 tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center"
        onClick={() => setShow(false)}>
        <div
          className="tw-w-1/2 tw-h-5/6 tw-bg-white tw-rounded tw-p-4 tw-text-sm tw-overflow-auto"
          onClick={(e) => e.stopPropagation()}>
          {messages.map((message) => (
            <div className="tw-mt-4">
              <div className="tw-flex tw-items-center tw-mb-2">
                <img
                  src={message.avatar}
                  className="tw-w-8 tw-h-8 tw-rounded tw-mr-2"
                />
                <span className="tw-text-sm tw-font-bold">{message.name}</span>
              </div>
              <div className="tw-ml-4 tw-bg-teal-50 tw-p-2">
                {convertMessageToElement(message)}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );
};
export default ConversationModal;
