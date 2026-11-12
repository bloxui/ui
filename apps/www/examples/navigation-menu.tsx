import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@blox-ui/ui";

export default function NavigationMenuExample() {
  return (
    <div className="min-h-56">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Components</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-72 gap-1">
                <li>
                  <NavigationMenuLink href="#" title="Button" description="Triggers an action." />
                </li>
                <li>
                  <NavigationMenuLink href="#" title="Dialog" description="A window over the page." />
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#" active>Docs</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
