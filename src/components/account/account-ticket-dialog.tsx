"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { createPortal } from "react-dom";

import { usePortalDialog } from "@/components/account/use-portal-dialog";
import {
  formatDateTime,
  initialsFromName,
  ticketStatus,
} from "@/lib/account/format";
import type { AccountTicket } from "@/lib/account/types";

type AccountTicketDialogProps = {
  ticket: AccountTicket | null;
  customerName: string;
  open: boolean;
  onClose: () => void;
  onReply?: (ticketId: number, body: string) => Promise<void> | void;
};

function messageInitials(name: string) {
  return initialsFromName(name);
}

export function AccountTicketDialog({
  ticket,
  customerName,
  open,
  onClose,
  onReply,
}: AccountTicketDialogProps) {
  const [mounted, setMounted] = useState(false);
  const { dialogRef, handleBackdropClick, close } = usePortalDialog(open, onClose);
  const [replyStatus, setReplyStatus] = useState("");
  const [sending, setSending] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open && ticket) setReplyStatus("");
  }, [open, ticket]);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!ticket || !onReply) return;
      const form = e.currentTarget;
      const body = new FormData(form).get("body");
      const text = String(body ?? "").trim();
      if (!text) return;

      setSending(true);
      setReplyStatus("Sending…");
      try {
        await onReply(ticket.id, text);
        form.reset();
        setReplyStatus("");
        close();
      } catch {
        setReplyStatus("Could not send your reply.");
      } finally {
        setSending(false);
      }
    },
    [close, onReply, ticket]
  );

  if (!mounted || !ticket) return null;

  const st = ticketStatus(ticket);
  const messages = ticket.conversations ?? [];

  return createPortal(
    <dialog
      ref={dialogRef}
      className="a295-dialog"
      data-ticket-dialog
      aria-labelledby="a315TicketDialogTitle"
      onClick={handleBackdropClick}
      onClose={onClose}
    >
      <div className="a295-dialog-shell">
        <header className="a295-dialog-head">
          <div className="a295-dialog-title">
            <span>Support request #{ticket.id}</span>
            <h2 id="a315TicketDialogTitle">{ticket.subject}</h2>
          </div>
          <button
            type="button"
            className="a295-dialog-close"
            aria-label="Close support request"
            onClick={close}
          >
            ×
          </button>
        </header>
        <div className="a295-dialog-body">
          <section className="a315-ticket-summary" aria-label="Support request details">
            <div className="a315-ticket-summary-top">
              <div className="a315-ticket-state">
                <span className={`a295-status ${st.cls}`}>{st.label}</span>
                <span>Last updated {formatDateTime(ticket.updatedAt)}</span>
              </div>
            </div>
            <dl className="a315-ticket-facts">
              <div className="a315-ticket-fact">
                <dt>Category</dt>
                <dd>{ticket.category || "Support request"}</dd>
              </div>
              <div className="a315-ticket-fact">
                <dt>Order</dt>
                <dd>{ticket.orderNumber || "Not linked to an order"}</dd>
              </div>
              <div className="a315-ticket-fact">
                <dt>Opened</dt>
                <dd>{formatDateTime(ticket.createdAt)}</dd>
              </div>
            </dl>
          </section>

          <section className="a315-thread" aria-label="Support conversation">
            <div className="a315-thread-head">
              <h3>Conversation</h3>
              <span>
                {messages.length} {messages.length === 1 ? "message" : "messages"}
              </span>
            </div>
            <div className="a315-thread-list">
              {messages.map((c) =>
                c.customer ? (
                  <article
                    key={c.id}
                    className="a315-thread-message is-customer"
                  >
                    <div className="a315-thread-content">
                      <div className="a315-thread-byline">
                        <strong>You</strong>
                        <time dateTime={c.createdAt}>
                          {formatDateTime(c.createdAt)}
                        </time>
                      </div>
                      <div className="a315-thread-bubble">{c.body}</div>
                    </div>
                    <span className="a315-thread-avatar" aria-hidden>
                      {messageInitials(c.from || customerName)}
                    </span>
                  </article>
                ) : (
                  <article key={c.id} className="a315-thread-message">
                    <span className="a315-thread-avatar" aria-hidden>
                      IS
                    </span>
                    <div className="a315-thread-content">
                      <div className="a315-thread-byline">
                        <strong>{c.from || "Intangles Support"}</strong>
                        <time dateTime={c.createdAt}>
                          {formatDateTime(c.createdAt)}
                        </time>
                      </div>
                      <div className="a315-thread-bubble">{c.body}</div>
                    </div>
                  </article>
                )
              )}
            </div>
          </section>

          <form className="a315-reply" data-ticket-reply-form onSubmit={handleSubmit}>
            <div className="a315-reply-head">
              <div>
                <strong>Reply to Intangles Support</strong>
                <span>
                  Your reply will stay attached to support request #{ticket.id}.
                </span>
              </div>
            </div>
            <textarea
              id="a295ReplyBody"
              name="body"
              required
              placeholder="Write your reply…"
              aria-label="Reply to Intangles Support"
              disabled={!onReply}
            />
            <div className="a315-reply-footer">
              <div className="a315-attachment-field">
                <label htmlFor="a295ReplyFiles">Attachments, optional</label>
                <input
                  id="a295ReplyFiles"
                  name="attachments"
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                />
                <span className="a315-attachment-hint">
                  Add photos or PDFs if they help show the issue.
                </span>
              </div>
              <button
                type="submit"
                className="a295-btn primary"
                disabled={sending || !onReply}
              >
                Send Reply
              </button>
            </div>
            <p
              className={`a295-form-status${replyStatus.includes("Could not") ? " bad" : ""}`}
              data-reply-status
              aria-live="polite"
            >
              {replyStatus}
            </p>
          </form>
        </div>
      </div>
    </dialog>,
    document.body
  );
}
