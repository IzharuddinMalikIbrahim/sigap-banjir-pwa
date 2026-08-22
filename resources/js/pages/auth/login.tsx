import { Form, Head } from '@inertiajs/react';
import { Waves } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <div className="w-full font-sans antialiased selection:bg-teal-700 selection:text-white">
            <Head title="Masuk - SIGAP BANJIR" />

            {/* Branding Header Login */}
            <div className="mb-8 flex flex-col items-center justify-center space-y-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-800 shadow-md shadow-teal-900/20">
                    <Waves className="h-7 w-7 text-white" />
                </div>
                <div className="text-center">
                    <h1 className="text-xl font-black tracking-wider text-slate-900">
                        SIGAP BANJIR
                    </h1>
                    <p className="text-xs font-semibold text-slate-500">
                        Sistem Informasi & Gotong Royong
                    </p>
                </div>
            </div>

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">
                            {/* Input Email */}
                            <div className="grid gap-2">
                                <Label 
                                    htmlFor="email"
                                    className="text-xs font-bold uppercase tracking-wider text-slate-700"
                                >
                                    Alamat Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="email@contoh.com"
                                    className="h-11 rounded-xl border-slate-200 bg-slate-50/70 px-3.5 text-sm text-slate-800 transition focus-visible:border-teal-700 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-teal-700"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Input Password */}
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label 
                                        htmlFor="password"
                                        className="text-xs font-bold uppercase tracking-wider text-slate-700"
                                    >
                                        Kata Sandi
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="ml-auto text-[11px] font-semibold text-teal-700 transition hover:text-teal-900 hover:underline hover:decoration-teal-700/30 hover:underline-offset-2"
                                            tabIndex={5}
                                        >
                                            Lupa kata sandi?
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Masukkan kata sandi"
                                    className="h-11 rounded-xl border-slate-200 bg-slate-50/70 px-3.5 text-sm text-slate-800 transition focus-visible:border-teal-700 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-teal-700"
                                />
                                <InputError message={errors.password} />
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center space-x-2.5">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="rounded border-slate-300 text-teal-700 data-[state=checked]:border-teal-700 data-[state=checked]:bg-teal-700"
                                />
                                <Label 
                                    htmlFor="remember"
                                    className="cursor-pointer text-xs font-semibold text-slate-600"
                                >
                                    Ingat sesi saya
                                </Label>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-teal-800 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-teal-900/20 transition hover:bg-teal-900 active:scale-[0.98] disabled:opacity-50"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner className="h-4 w-4" />}
                                <span>Masuk ke Sistem</span>
                            </Button>
                        </div>

                        {/* Sign Up Link */}
                        <div className="text-center text-xs font-medium text-slate-500">
                            Belum mendaftarkan diri?{' '}
                            <TextLink 
                                href={register()} 
                                tabIndex={5}
                                className="font-bold text-teal-700 transition hover:text-teal-900 hover:underline hover:decoration-teal-700/30 hover:underline-offset-2"
                            >
                                Buat Akun Baru
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>

            {/* Success/Status Message */}
            {status && (
                <div className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-800">
                    {status}
                </div>
            )}
        </div>
    );
}
