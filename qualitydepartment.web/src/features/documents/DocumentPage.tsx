import React, { useCallback, useEffect, useMemo, useState } from "react";

/**
 * DocumentPage.tsx
 * Простая страница управления документами.
 * - Загрузка списка документов
 * - Загрузка нового файла
 * - Удаление документа
 *
 * Примечания:
 * - API-запросы сделаны через fetch и предполагают стандартные роуты:
 *   GET  /api/documents
 *   POST /api/documents    (form-data: file)
 *   DELETE /api/documents/:id
 *
 * При необходимости адаптировать под существующий API в проекте.
 */

type DocumentItem = {
  id: string;
  title: string;
  url?: string;
  author?: string;
  createdAt?: string;
};

export const DocumentPage: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/documents");
      if (!res.ok) throw new Error(`Ошибка загрузки: ${res.statusText}`);
      const data = (await res.json()) as DocumentItem[];
      setDocuments(data || []);
    } catch (err: any) {
      setError(err?.message ?? "Неизвестная ошибка при загрузке документов");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      // Можно добавить дополнительные поля при необходимости
      const res = await fetch("/api/documents", {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Ошибка загрузки файла");
      }
      // Обновим список после успешной загрузки
      await fetchDocuments();
    } catch (err: any) {
      setError(err?.message ?? "Не удалось загрузить файл");
    } finally {
      setUploading(false);
      // Сброс input
      e.currentTarget.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить документ?")) return;
    setError(null);
    try {
      const res = await fetch(`/api/documents/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Ошибка при удалении");
      }
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } catch (err: any) {
      setError(err?.message ?? "Не удалось удалить документ");
    }
  };

  const sortedDocuments = useMemo(
    () =>
      [...documents].sort((a, b) => {
        const ta = a.createdAt ? Date.parse(a.createdAt) : 0;
        const tb = b.createdAt ? Date.parse(b.createdAt) : 0;
        return tb - ta;
      }),
    [documents]
  );

  return (
    <div style={{ padding: 20 }}>
      <h2>Документы</h2>

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
          <input
            type="file"
            onChange={handleFileChange}
            disabled={uploading}
            accept="*/*"
          />
          <span>{uploading ? "Загрузка..." : "Загрузить файл"}</span>
        </label>
      </div>

      {error && (
        <div style={{ color: "crimson", marginBottom: 12 }} role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div>Загрузка списка документов...</div>
      ) : sortedDocuments.length === 0 ? (
        <div>Документы не найдены.</div>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: 8,
          }}
        >
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ddd" }}>
                Название
              </th>
              <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ddd" }}>
                Автор
              </th>
              <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ddd" }}>
                Дата
              </th>
              <th style={{ padding: 8, borderBottom: "1px solid #ddd" }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {sortedDocuments.map((doc) => (
              <tr key={doc.id}>
                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>
                  {doc.url ? (
                    <a href={doc.url} target="_blank" rel="noopener noreferrer">
                      {doc.title || "Без названия"}
                    </a>
                  ) : (
                    doc.title || "Без названия"
                  )}
                </td>
                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>
                  {doc.author ?? "—"}
                </td>
                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>
                  {doc.createdAt
                    ? new Date(doc.createdAt).toLocaleString("ru-RU")
                    : "—"}
                </td>
                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>
                  <button
                    onClick={() => {
                      if (doc.url) window.open(doc.url, "_blank");
                    }}
                    disabled={!doc.url}
                    style={{ marginRight: 8 }}
                    title="Открыть"
                  >
                    Открыть
                  </button>
                  <button onClick={() => handleDelete(doc.id)} title="Удалить">
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DocumentPage;