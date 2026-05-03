"use client";

import { useState } from "react";
import { Check, X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RejectModal } from "./RejectModal";
import { approveContentRequest, rejectContentRequest, retryContentRequest } from "@/lib/api";
import { useToast } from "@/components/ui/toast";
import { track } from "@/lib/analytics";

const RETRY_MAX = 3;

interface ApprovalButtonsProps {
  postId: string;
  retryCount: number;
  onAction: () => void;
  captionOverride?: string | null;
}

export function ApprovalButtons({ postId, retryCount, onAction, captionOverride }: ApprovalButtonsProps) {
  const [approving, setApproving] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [showRetryModal, setShowRetryModal] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const { toast } = useToast();

  const canRetry = retryCount < RETRY_MAX;
  const isDisabled = approving || retrying;

  const handleApprove = async () => {
    setApproving(true);
    try {
      await approveContentRequest(postId);
      track("post_approved", { post_id: postId });
      toast("Post aprovado! Publicando no Instagram...");
      onAction();
    } catch {
      toast("Erro ao aprovar. Tente novamente.", "error");
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async (reason: string) => {
    setRejecting(true);
    try {
      await rejectContentRequest(postId, reason);
      toast("Post rejeitado.");
      setShowReject(false);
      onAction();
    } catch {
      toast("Erro ao rejeitar. Tente novamente.", "error");
    } finally {
      setRejecting(false);
    }
  };

  const handleRetry = async () => {
    setShowRetryModal(false);
    setRetrying(true);
    try {
      await retryContentRequest(postId);
      toast("Gerando nova versão... O card será atualizado em instantes.");
      onAction();
    } catch {
      toast("Erro ao gerar nova versão. Tente novamente.", "error");
    } finally {
      setRetrying(false);
    }
  };

  return (
    <>
      {/* Indicador de versão */}
      {retryCount > 0 && (
        <p className="text-xs text-gray-400 mb-2">
          Versão {retryCount + 1} de {RETRY_MAX + 1}
        </p>
      )}
      {!canRetry && (
        <p className="text-xs text-amber-500 mb-2">Máximo de versões atingido</p>
      )}

      <div className="flex gap-2 mt-3">
        <Button
          variant="success"
          size="sm"
          className="flex-1"
          loading={approving}
          disabled={isDisabled}
          onClick={handleApprove}
        >
          <Check className="h-4 w-4" />
          Aprovar
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="flex-1"
          onClick={() => setShowReject(true)}
          disabled={isDisabled}
        >
          <X className="h-4 w-4" />
          Rejeitar
        </Button>
        {canRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRetryModal(true)}
            disabled={isDisabled}
            loading={retrying}
            title="Gerar nova versão da legenda"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Modal rejeição */}
      {showReject && (
        <RejectModal
          onConfirm={handleReject}
          onCancel={() => setShowReject(false)}
          loading={rejecting}
        />
      )}

      {/* Modal confirmação retry */}
      {showRetryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-xl">
            <h3 className="font-semibold text-gray-900 mb-2">Gerar nova versão?</h3>
            <p className="text-sm text-gray-600 mb-4">
              A legenda atual será substituída por uma nova gerada pelo agente.
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="flex-1" onClick={() => setShowRetryModal(false)}>
                Cancelar
              </Button>
              <Button variant="default" size="sm" className="flex-1" onClick={handleRetry}>
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
