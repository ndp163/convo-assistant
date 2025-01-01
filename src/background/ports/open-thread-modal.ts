import type { PlasmoMessaging } from '@plasmohq/messaging';

export const OPEN_THREAD_MODAL = 'open-thread-modal';

export type ThreadMessage = {
  messageId: string;
  content: string;
  avatar: string;
  name: string;
}

const ThreadModalHandler: PlasmoMessaging.PortHandler = async (
  req,
  res
) => {
  res.send(req.body);
};

export default ThreadModalHandler;
