import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@blox-ui/ui";

export default function DrawerExample() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="soft">Share</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Share this page</DrawerTitle>
            <DrawerDescription>Drag the handle down to dismiss.</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button>Copy link</Button>
            <DrawerClose asChild>
              <Button variant="outline" tone="neutral">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
