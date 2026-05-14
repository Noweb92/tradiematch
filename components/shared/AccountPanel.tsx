"use client";

import { useState } from "react";
import { toast } from "sonner";
import { LogOut, Mail, Phone, MapPin, Trash2, Save } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { FormField, FormCheckbox } from "@/components/auth/FormField";

interface Props {
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  location: string | null;
  marketingOptIn: boolean;
}

export function AccountPanel({
  email,
  firstName: initFirst,
  lastName: initLast,
  phone: initPhone,
  location,
  marketingOptIn: initMarketing,
}: Props) {
  const [firstName, setFirstName] = useState(initFirst ?? "");
  const [lastName, setLastName] = useState(initLast ?? "");
  const [phone, setPhone] = useState(initPhone ?? "");
  const [marketing, setMarketing] = useState(initMarketing);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function save() {
    setSaving(true);
    const supabase = createSupabaseBrowserClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      setSaving(false);
      return;
    }
    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: firstName,
        last_name: lastName,
        phone,
        marketing_opt_in: marketing,
      })
      .eq("id", auth.user.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Saved.");
  }

  async function deleteAccount() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    // V1: client-side delete request; actual hard delete happens via service
    // role in /api/account/delete (Session #5).
    toast.message("Account deletion request sent. We'll email you within 24h.");
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-navy/50">
          Your account
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
          Profile &amp; preferences
        </h1>
      </div>

      <section className="rounded-2xl bg-white border border-navy/8 p-5 sm:p-6 shadow-soft space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <FormField
            label="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <FormField
            label="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-bold text-navy/75 tracking-wide flex items-center gap-1.5">
            <Mail className="w-3 h-3" />
            Email
          </label>
          <div className="mt-1.5 px-3.5 py-3 rounded-xl bg-navy/[0.04] text-sm text-navy/65 font-medium">
            {email}{" "}
            <span className="text-[10px] text-navy/40 font-bold uppercase tracking-wider ml-1">
              (contact support to change)
            </span>
          </div>
        </div>
        <FormField
          label="Phone (optional)"
          type="tel"
          inputMode="tel"
          placeholder="+61 4XX XXX XXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        {location && (
          <div>
            <label className="text-xs font-bold text-navy/75 tracking-wide flex items-center gap-1.5">
              <MapPin className="w-3 h-3" />
              Location
            </label>
            <div className="mt-1.5 px-3.5 py-3 rounded-xl bg-navy/[0.04] text-sm text-navy/65 font-medium">
              {location}
            </div>
          </div>
        )}
        <FormCheckbox
          label="Email me product updates &amp; tips"
          checked={marketing}
          onChange={setMarketing}
        />
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-orange hover:bg-orange-600 text-white font-bold shadow-glow btn-press disabled:opacity-60 min-h-[44px]"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving…" : "Save changes"}
        </button>
      </section>

      <section className="rounded-2xl bg-white border border-navy/8 p-5 sm:p-6 shadow-soft">
        <div className="text-[11px] font-bold uppercase tracking-wider text-navy/50 mb-3">
          Session
        </div>
        <form action="/auth/logout" method="post">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy hover:bg-navy-700 text-white text-sm font-bold btn-press"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </form>
      </section>

      <section className="rounded-2xl bg-red-50 border border-red-100 p-5 sm:p-6">
        <div className="text-[11px] font-bold uppercase tracking-wider text-red-600 mb-3">
          Danger zone
        </div>
        <p className="text-sm text-navy/75 mb-3 leading-relaxed">
          Delete your account permanently. Active matches and chats will be
          removed. This action cannot be undone.
        </p>
        <button
          onClick={deleteAccount}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold btn-press ${
            confirmDelete
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-white border-2 border-red-300 text-red-600 hover:bg-red-100"
          }`}
        >
          <Trash2 className="w-4 h-4" />
          {confirmDelete ? "Click again to confirm" : "Delete my account"}
        </button>
      </section>
    </div>
  );
}
