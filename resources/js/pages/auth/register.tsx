import { Form, Head } from '@inertiajs/react';
import { Waves } from 'lucide-react';

import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

import { login } from '@/routes';
import { store } from '@/routes/register';

type Props = {
    passwordRules: string;
};

export default function Register({
    passwordRules,
}: Props) {
    return (
        <div className="w-full font-sans antialiased selection:bg-teal-700 selection:text-white">
            <Head title="Daftar - SIGAP BANJIR" />

            {/* Branding */}
            <div className="mb-8 flex flex-col items-center justify-center space-y-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-800 shadow-md shadow-teal-900/20">
                    <Waves className="h-7 w-7 text-white" />
                </div>

                <div className="text-center">
                    <h1 className="text-xl font-black tracking-wider text-slate-900">
                        SIGAP BANJIR
                    </h1>

                    <p className="text-xs font-semibold text-slate-500">
                        Bergabung untuk Partisipasi Mitigasi
                    </p>
                </div>
            </div>

            <Form
                {...store.form()}
                resetOnSuccess={[
                    'password',
                    'password_confirmation',
                ]}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">
                            {/* Nama */}
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="name"
                                    className="text-xs font-bold uppercase tracking-wider text-slate-700"
                                >
                                    Nama Lengkap
                                </Label>

                                <Input
                                    id="name"
                                    type="text"
                                    name="name"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    placeholder="Masukkan nama lengkap"
                                    className="h-11 rounded-xl border-slate-200 bg-slate-50/70 px-3.5 text-sm text-slate-800 transition focus-visible:border-teal-700 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-teal-700"
                                />

                                <InputError
                                    message={errors.name}
                                />
                            </div>

                            {/* Email */}
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
                                    tabIndex={2}
                                    autoComplete="email"
                                    placeholder="email@contoh.com"
                                    className="h-11 rounded-xl border-slate-200 bg-slate-50/70 px-3.5 text-sm text-slate-800 transition focus-visible:border-teal-700 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-teal-700"
                                />

                                <InputError
                                    message={errors.email}
                                />
                            </div>

                            {/* Password */}
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="password"
                                    className="text-xs font-bold uppercase tracking-wider text-slate-700"
                                >
                                    Kata Sandi
                                </Label>

                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    placeholder="Buat kata sandi"
                                    passwordrules={passwordRules}
                                    className="h-11 rounded-xl border-slate-200 bg-slate-50/70 px-3.5 text-sm text-slate-800 transition focus-visible:border-teal-700 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-teal-700"
                                />

                                <InputError
                                    message={errors.password}
                                />
                            </div>

                            {/* Password Confirmation */}
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="password_confirmation"
                                    className="text-xs font-bold uppercase tracking-wider text-slate-700"
                                >
                                    Konfirmasi Kata Sandi
                                </Label>

                                <PasswordInput
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    placeholder="Ulangi kata sandi"
                                    passwordrules={passwordRules}
                                    className="h-11 rounded-xl border-slate-200 bg-slate-50/70 px-3.5 text-sm text-slate-800 transition focus-visible:border-teal-700 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-teal-700"
                                />

                                <InputError
                                    message={
                                        errors.password_confirmation
                                    }
                                />
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                disabled={processing}
                                tabIndex={5}
                                data-test="register-user-button"
                                className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-teal-800 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-teal-900/20 transition hover:bg-teal-900 active:scale-[0.98] disabled:opacity-50"
                            >
                                {processing && (
                                    <Spinner className="h-4 w-4" />
                                )}

                                <span>
                                    Daftar Akun Baru
                                </span>
                            </Button>
                        </div>

                        {/* Login Link */}
                        <div className="text-center text-xs font-medium text-slate-500">
                            Sudah memiliki akun?{' '}
                            <TextLink
                                href={login()}
                                tabIndex={6}
                                className="font-bold text-teal-700 transition hover:text-teal-900 hover:underline hover:decoration-teal-700/30 hover:underline-offset-2"
                            >
                                Masuk ke Sistem
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </div>
    );
}
