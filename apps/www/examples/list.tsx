import { ChevronRight, FileText, Image as ImageIcon, Music } from "lucide-react";
import { Avatar, Badge, List, ListItem } from "@blox-ui/ui";

export default function ListExample() {
  return (
    <div className="grid w-full max-w-md gap-6">
      <List bordered header="Team">
        <ListItem prefix={<Avatar name="Ada Lovelace" size="sm" />} title="Ada Lovelace" description="ada@studio.dev" suffix={<Badge size="sm">Owner</Badge>} />
        <ListItem prefix={<Avatar name="Alan Turing" size="sm" />} title="Alan Turing" description="alan@studio.dev" suffix={<Badge size="sm">Editor</Badge>} />
      </List>
      <List aria-label="Recent files">
        <ListItem prefix={<FileText />} title="Q3 report.pdf" description="2.4 MB" suffix={<ChevronRight className="size-4" />} action={<a href="#" />} />
        <ListItem prefix={<ImageIcon />} title="Hero.png" description="840 KB" suffix={<ChevronRight className="size-4" />} action={<a href="#" />} />
        <ListItem prefix={<Music />} title="Intro.mp3" description="3.1 MB" suffix={<ChevronRight className="size-4" />} action={<a href="#" />} />
      </List>
    </div>
  );
}
