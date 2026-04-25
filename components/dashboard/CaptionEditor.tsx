"use client";

import { useState } from "react";
import { Pencil, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { patchContentRequest } from "@/lib/api";
import { useToast } from "@/components/ui/toast";

const MAX_CAPTION_LENGTH = 2200;

interface CaptionEditorProps {
  postId: string;
  caption: string;
  captionEdited: boolean;
  onSave: (newCaption: string) => void;
}

export function CaptionEditor({ postId, caption, captionEdited, onSave }: CaptionEditorProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(caption);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleEdit = () => {
    setDraft(caption);
    setEditing(true);
  };

  const handleCancel = () => {
    setDraft(caption);
    setEditing(false);
  };

  const handleSave = async () => {
    if (draft === caption) { setEditing(false); return; }
    setSaving(true);
    try {
      await patchContentRequest(postId, draft);
      onSave(draft);
      setEditing(false);
      toast("Legenda atualizada.");
    } catch {
      toast("Erro ao salvar legenda. Tente novamente.", "error");
    } finally {
      setSaving(false);
    }
  };

  const charCount = draft.length;
  const overLimit = charCount > MAX_CAPTION_LENGTH;

  if (editing) {
    return (
      <div className="space-y-2">
        <textarea
          className="w-full rounded-lg border border-gray-300 p-2 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={5}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          autoFocus
        />
        <div className="flex items-center justify-between">
          <span className={`text-xs ${overLimit ? "text-red-500 font-medium" : "text-gray-400"}`}>
            {charCount}/{MAX_CAPTION_LENGTH}
          </span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleCancel} disabled={saving}>
              <X className="h-3 w-3" />
              Cancelar
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              loading={saving}
              disabled={overLimit}
            >
              <Check className="h-3 w-3" />
              Salvar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative">
      <p className="text-sm text-gray-700 whitespace-pre-line">{caption}</p>
      <div className="flex items-center gap-1.5 mt-1">
        {captionEdited && (
          <span className="text-xs text-blue-500 font-medium">editado</span>
        )}
        <button
          onClick={handleEdit}
          className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-blue-600 transition-colors"
          title="Editar legenda"
        >
          <Pencil className="h-3 w-3" />
          Editar
        </button>
      </div>
    </div>
  );
}
