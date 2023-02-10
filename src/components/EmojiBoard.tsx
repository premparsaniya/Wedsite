import Picker, {

  Theme,
  EmojiClickData,
} from "emoji-picker-react";
type Props = {
  addEmoji?: (a: any) => void
}
const EmojiBoard = ({ addEmoji = () => { } }: Props) => {


  const onEmojiClick = (emojiObject: EmojiClickData, event: MouseEvent) => {
    addEmoji(`${emojiObject.emoji}`)
  }

  return (
    <div className="absolute">
      <Picker
        onEmojiClick={onEmojiClick}
        // theme={Theme.AUTO}
        lazyLoadEmojis
      />
    </div>
  );
}

export default EmojiBoard