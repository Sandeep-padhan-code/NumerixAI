import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PasswordForm } from "@/app/dashboard/settings/password-form";

const settings = [
  ["Database", "SQLite via Prisma at DATABASE_URL, default file:./dev.db"],
  ["Password", "Default password is numerixai. Set APP_PASSWORD_HASH to a SHA-256 hash to change it."],
  ["AI Providers", "Gemini primary, DeepSeek secondary, OpenRouter fallback."],
  ["Privacy", "Single-user local app. No billing, teams, or cloud database."]
];

export default function SettingsPage() {
  return (
    <div className="space-y-5">
      <section className="glass rounded-2xl p-6">
        <p className="text-sm text-primary">Configuration</p>
        <h1 className="mt-2 text-3xl font-black tracking-normal">Settings</h1>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <PasswordForm />
        {settings.map(([title, text]) => (
          <Card key={title}>
            <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
            <CardContent className="text-sm leading-6 text-muted-foreground">{text}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
