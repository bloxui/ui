import { Tabs, TabsContent, TabsList, TabsTrigger } from "@blox-ui/ui";

export default function TabsExample() {
  return (
    <Tabs defaultValue="account" className="w-full max-w-md">
      <TabsList aria-label="Settings">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
        <TabsTrigger value="team" disabled>Team</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="text-sm text-muted">Manage your account details.</TabsContent>
      <TabsContent value="billing" className="text-sm text-muted">Update your plan and payment method.</TabsContent>
    </Tabs>
  );
}
