"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Zap } from "lucide-react";
import { useSession } from "@/lib/auth/useSession";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";

const STEPS = ["Identity", "Organization", "Interests", "Geography"];
const INTEREST_OPTIONS = ["AI/ML","Cloud","Enterprise","Cyber","Data","Engineering Leadership","Digital Transformation","FinTech","HealthTech"];
const CITY_OPTIONS = ["Dallas","Austin","Houston","San Antonio","Fort Worth","Plano","Irving","Arlington","Frisco","McKinney"];
const INDUSTRY_OPTIONS = ["Technology","FinTech","HealthTech","Energy","Retail","Government","Education","Manufacturing","Consulting","Media"];
const SIZE_OPTIONS = ["1–50","51–200","201–1,000","1,001–5,000","5,000+"];

interface FormData {
  name: string; email: string; linkedin: string;
  company: string; title: string; industry: string; website: string; companySize: string;
  interests: string[]; cities: string[];
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

const inputCls = "w-full rounded-[14px] border border-black/[0.08] bg-white px-4 py-2.5 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#4F5FE8]/60 focus:ring-2 focus:ring-[#4F5FE8]/10 transition-all duration-200 shadow-sm appearance-none";

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-medium text-[#4B5563] uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useSession();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [building, setBuilding] = useState(false);
  const [form, setForm] = useState<FormData>({
    name: "", email: "", linkedin: "",
    company: "", title: "", industry: "", website: "", companySize: "",
    interests: [], cities: ["Dallas"],
  });

  const update = (field: keyof FormData, value: string | string[]) =>
    setForm((f) => ({ ...f, [field]: value }));

  const toggleArr = (field: "interests" | "cities", val: string) =>
    setForm((f) => ({
      ...f,
      [field]: f[field].includes(val) ? f[field].filter((x) => x !== val) : [...f[field], val],
    }));

  const next = () => {
    if (step < STEPS.length - 1) { setDir(1); setStep((s) => s + 1); }
    else handleComplete();
  };
  const back = () => { if (step > 0) { setDir(-1); setStep((s) => s - 1); } };

  const handleComplete = async () => {
    setBuilding(true);
    await new Promise((r) => setTimeout(r, 2000));
    login(form.email || "user@example.com", "");
    router.push("/");
  };

  if (building) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F9FC]">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4F5FE8] to-[#0EA5A0] flex items-center justify-center mx-auto mb-6 shadow-[0_4px_32px_rgba(79,95,232,0.3)]">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-[#111827] mb-2">Building your executive network…</h2>
          <p className="text-[#9CA3AF] text-sm">Mapping relationships across Dallas & Texas</p>
          <div className="mt-8 flex justify-center gap-2">
            {[0,1,2].map((i) => (
              <motion.div key={i} className="w-2 h-2 rounded-full bg-[#4F5FE8]"
                animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }} />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-[#F8F9FC]">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#4F5FE8] to-[#0EA5A0] flex items-center justify-center shadow-[0_2px_10px_rgba(79,95,232,0.25)]">
              <Zap className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-base font-semibold text-[#111827]">Executive Connect</span>
          </div>
          <div className="flex items-center justify-center gap-2 mb-6">
            {STEPS.map((s, i) => (
              <div key={s} className={cn("h-1.5 rounded-full transition-all duration-300",
                i < step ? "w-6 bg-[#0EA5A0]" : i === step ? "w-8 bg-[#4F5FE8]" : "w-4 bg-black/10")} />
            ))}
          </div>
          <p className="text-xs text-[#9CA3AF] uppercase tracking-wider">
            Step {step + 1} of {STEPS.length} — {STEPS[step]}
          </p>
        </div>

        <div className="bg-white rounded-[20px] border border-black/[0.07] shadow-sm p-6 overflow-hidden">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key={step} custom={dir} variants={slideVariants}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.28, ease: "easeOut" }} className="space-y-4">
              {step === 0 && (
                <>
                  <h2 className="text-xl font-semibold text-[#111827] mb-4">Let&apos;s start with you</h2>
                  <Field label="Full Name" id="reg-name"><input id="reg-name" value={form.name} onChange={e=>update("name",e.target.value)} placeholder="Alex Morgan" className={inputCls}/></Field>
                  <Field label="Work Email" id="reg-email"><input id="reg-email" type="email" value={form.email} onChange={e=>update("email",e.target.value)} placeholder="alex@company.com" className={inputCls}/></Field>
                  <Field label="LinkedIn URL" id="reg-linkedin"><input id="reg-linkedin" value={form.linkedin} onChange={e=>update("linkedin",e.target.value)} placeholder="linkedin.com/in/yourname" className={inputCls}/></Field>
                </>
              )}
              {step === 1 && (
                <>
                  <h2 className="text-xl font-semibold text-[#111827] mb-4">Your organization</h2>
                  <Field label="Organization" id="reg-company"><input id="reg-company" value={form.company} onChange={e=>update("company",e.target.value)} placeholder="Company name" className={inputCls}/></Field>
                  <Field label="Title" id="reg-title"><input id="reg-title" value={form.title} onChange={e=>update("title",e.target.value)} placeholder="Chief Technology Officer" className={inputCls}/></Field>
                  <Field label="Industry" id="reg-industry">
                    <select id="reg-industry" value={form.industry} onChange={e=>update("industry",e.target.value)} className={inputCls}>
                      <option value="">Select industry</option>
                      {INDUSTRY_OPTIONS.map(o=><option key={o} value={o}>{o}</option>)}
                    </select>
                  </Field>
                  <Field label="Company Size" id="reg-size">
                    <select id="reg-size" value={form.companySize} onChange={e=>update("companySize",e.target.value)} className={inputCls}>
                      <option value="">Select size</option>
                      {SIZE_OPTIONS.map(o=><option key={o} value={o}>{o}</option>)}
                    </select>
                  </Field>
                </>
              )}
              {step === 2 && (
                <>
                  <h2 className="text-xl font-semibold text-[#111827] mb-1">Your focus areas</h2>
                  <p className="text-sm text-[#9CA3AF] mb-4">Select all that apply</p>
                  <div className="flex flex-wrap gap-2">
                    {INTEREST_OPTIONS.map((opt) => (
                      <button key={opt} type="button" id={`interest-${opt.replace(/\//g,"-").replace(/\s/g,"-").toLowerCase()}`}
                        onClick={() => toggleArr("interests", opt)}
                        className={cn("px-3.5 py-1.5 rounded-full text-sm border transition-all duration-150",
                          form.interests.includes(opt)
                            ? "border-[#4F5FE8] bg-[#4F5FE8]/10 text-[#4F5FE8] font-medium"
                            : "border-black/[0.08] bg-white text-[#4B5563] hover:border-[#4F5FE8]/40 hover:text-[#4F5FE8]")}>
                        {form.interests.includes(opt) && <Check className="inline w-3 h-3 mr-1 -mt-0.5" />}
                        {opt}
                      </button>
                    ))}
                  </div>
                </>
              )}
              {step === 3 && (
                <>
                  <h2 className="text-xl font-semibold text-[#111827] mb-1">Where are you based?</h2>
                  <p className="text-sm text-[#9CA3AF] mb-4">Select your target cities</p>
                  <div className="flex flex-wrap gap-2">
                    {CITY_OPTIONS.map((city) => (
                      <button key={city} type="button" id={`city-${city.toLowerCase().replace(/\s/g,"-")}`}
                        onClick={() => toggleArr("cities", city)}
                        className={cn("px-3.5 py-1.5 rounded-full text-sm border transition-all duration-150",
                          form.cities.includes(city)
                            ? "border-[#0EA5A0] bg-[#0EA5A0]/10 text-[#0EA5A0] font-medium"
                            : "border-black/[0.08] bg-white text-[#4B5563] hover:border-[#0EA5A0]/40 hover:text-[#0EA5A0]")}>
                        {form.cities.includes(city) && <Check className="inline w-3 h-3 mr-1 -mt-0.5" />}
                        {city}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-5 flex items-center gap-3">
          {step > 0 && (
            <button id="register-back" onClick={back}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-[14px] border border-black/[0.08] bg-white text-sm text-[#4B5563] hover:text-[#111827] hover:border-black/20 transition-all shadow-sm">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          )}
          <button id="register-next" onClick={next}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-[14px] bg-[#4F5FE8] hover:bg-[#3D4ED4] text-white text-sm font-medium transition-all shadow-[0_2px_16px_rgba(79,95,232,0.25)]">
            {step === STEPS.length - 1 ? "Finish & Enter" : "Continue"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <p className="mt-5 text-center text-sm text-[#9CA3AF]">
          Already have an account?{" "}
          <Link href="/login" className="text-[#4F5FE8] hover:text-[#3D4ED4] transition-colors font-medium">Sign in →</Link>
        </p>
      </div>
    </div>
  );
}
