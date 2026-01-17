export default function EventsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">イベント</h1>
        <p className="text-sm text-muted-foreground mt-1">
          オフラインミートアップ企画
        </p>
      </div>

      <div className="rounded-lg bg-muted p-12 text-center">
        <p className="text-muted-foreground mb-2">近日公開予定</p>
        <p className="text-sm text-muted-foreground">
          オフラインミートアップ機能を準備中です
        </p>
      </div>
    </div>
  );
}
