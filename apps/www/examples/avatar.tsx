import { Avatar, AvatarGroup } from "@blox-ui/ui";

export default function AvatarExample() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Avatar name="Ada Lovelace" status="online" />
      <Avatar name="Alan Turing" size="lg" shape="square" status="busy" />
      <Avatar size="sm" />
      <AvatarGroup max={3}>
        <Avatar name="Ada Lovelace" />
        <Avatar name="Alan Turing" />
        <Avatar name="Grace Hopper" />
        <Avatar name="Linus Torvalds" />
        <Avatar name="Margaret Hamilton" />
      </AvatarGroup>
    </div>
  );
}
