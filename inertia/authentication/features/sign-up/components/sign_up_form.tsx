import { useState } from 'react'
import Input from '~/shared/ui/input'
import Button from '~/shared/ui/button'
import {
    StaggerContainer,
    StaggerItem,
} from '~/shared/ui/animations/stagger_container'
import { Form } from '@inertiajs/react'
import { toast } from 'react-hot-toast'


export default function SignUpForm() {
    const [showPassword, setShowPassword] = useState(false)


    return (
        <Form
            showProgress disableWhileProcessing
            onSuccess={(res) => {
                toast.success('User registered successfully')
                console.log(res)
            }}
            action={'/api/v1/register'} className="flex flex-col gap-4" method="POST">{

                ({
                    errors,
                    setError,
                    processing,
                }) => {

                    console.log('Errors', errors)
                    return (
                        <StaggerContainer className="flex flex-col gap-4">
                            <StaggerItem>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <Input
                                        label="First Name"
                                        placeholder="Enter your first name"
                                        type="text"
                                        variant="brown-secondary"
                                        name='firstName'
                                        errors={errors}
                                        setError={setError}
                                    />
                                    <Input
                                        label="Last Name"
                                        placeholder="Enter your last name"
                                        type="text"
                                        variant="brown-secondary"
                                        name='lastName'
                                        errors={errors}
                                        setError={setError}
                                    />
                                </div>
                            </StaggerItem>
                            <StaggerItem>
                                <Input
                                    label="Email"
                                    placeholder="Enter your email address"
                                    type="email"
                                    variant="brown-secondary"
                                    name='email'
                                    errors={errors}
                                    setError={setError}

                                />
                            </StaggerItem>
                            <StaggerItem>
                                <Input
                                    label="Password"
                                    placeholder="Enter your password"
                                    type={showPassword ? 'text' : 'password'}
                                    variant="brown-secondary"
                                    name='password'
                                    errors={errors}
                                    setError={setError}
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
                                />
                            </StaggerItem>
                            <StaggerItem>
                                <Input
                                    label="Confirm Password"
                                    placeholder="Enter your password"
                                    type={showPassword ? 'text' : 'password'}
                                    variant="brown-secondary"
                                    name='passwordConfirmation'
                                    errors={errors}
                                    setError={setError}
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
                                />
                            </StaggerItem>

                            {errors?.error && <p className="text-red-400  mt-2 text-[10px]">{errors?.error}</p>}

                            <StaggerItem>
                                <Button
                                    disabled={processing}
                                    loading={processing}
                                    className="mt-4" variant="orange-primary">
                                    <span className="truncate">Create Account</span>
                                </Button>
                            </StaggerItem>
                        </StaggerContainer>
                    )
                }
            }
        </Form>
    )
}
