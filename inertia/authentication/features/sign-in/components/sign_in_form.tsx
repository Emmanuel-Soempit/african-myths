import { useState } from 'react'
import Input from '~/shared/ui/input'
import Button from '~/shared/ui/button'
import {
    StaggerContainer,
    StaggerItem,
} from '~/shared/ui/animations/stagger_container'
import { Form } from '@inertiajs/react'
import toast from 'react-hot-toast'
import Error from '~/shared/ui/error'

export default function SignInForm() {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <Form
            action="/api/v1/login"
            onSuccess={(res) => {
                toast.success('User login successfully')
                console.log(res)
            }}
            className="flex flex-col gap-4" method="POST">{
                ({ errors, processing, setError }) => {
                    console.log('Error', errors)
                    return <StaggerContainer className="flex flex-col gap-4">
                        <StaggerItem>
                            <Input
                                label="Email Address"
                                name='email'
                                placeholder="Enter your email address"
                                type="email"
                                variant="brown-secondary"
                                errors={errors}
                                setError={setError}
                            />
                        </StaggerItem>
                        <StaggerItem>
                            <Input
                                label="Password"
                                name='password'
                                placeholder="Enter your password"
                                type={showPassword ? 'text' : 'password'}
                                variant="brown-secondary"
                                rightElement={
                                    <button
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-[var(--color-brown-secondary)] dark:hover:text-white"
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <span className="material-symbols-outlined text-xl">
                                            {showPassword ? 'visibility' : 'visibility_off'}
                                        </span>
                                    </button>
                                }
                                errors={errors}
                                setError={setError}
                            />
                        </StaggerItem>
                        <StaggerItem>
                            <div className="text-right flex justify-between">
                                <StaggerItem>
                                    <Error errors={errors} />
                                </StaggerItem>
                                <p className="cursor-pointer text-sm font-normal leading-normal text-[var(--color-orange-primary)] underline hover:text-opacity-80">
                                    Forgot Password?
                                </p>
                            </div>
                        </StaggerItem>

                        <StaggerItem>
                            <Button
                                disabled={processing}
                                loading={processing}
                                className="mt-2" variant="orange-primary">
                                <span className="truncate">Sign In</span>
                            </Button>
                        </StaggerItem>
                    </StaggerContainer>
                }
            }

        </Form>
    )
}
