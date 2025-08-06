import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        magical: "bg-gradient-magical text-white shadow-magical hover:shadow-lg hover:scale-105 font-semibold",
        whimsical: "bg-secondary text-secondary-foreground border-2 border-accent shadow-soft hover:shadow-magical hover:scale-105 hover:bg-accent hover:text-accent-foreground",
        story: "bg-gradient-sunset text-warning-foreground shadow-soft hover:shadow-book hover:scale-105 font-medium",
        success: "bg-success text-success-foreground hover:bg-success/90 shadow-soft",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-14 rounded-lg px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        />
      )
    }
    
    return (
      <motion.button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        whileHover={{ 
          scale: variant === 'magical' || variant === 'whimsical' || variant === 'story' ? 1.05 : 1.02,
          boxShadow: variant === 'magical' ? "0 10px 40px -10px rgba(139, 92, 246, 0.4)" : undefined
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        onClick={props.onClick}
        disabled={props.disabled}
        type={props.type}
        form={props.form}
        name={props.name}
        value={props.value}
        autoFocus={props.autoFocus}
        tabIndex={props.tabIndex}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        onKeyDown={props.onKeyDown}
        onKeyUp={props.onKeyUp}
        onMouseDown={props.onMouseDown}
        onMouseUp={props.onMouseUp}
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
        aria-label={props['aria-label']}
        aria-describedby={props['aria-describedby']}
        data-testid={props['data-testid']}
      >
        {props.children}
      </motion.button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
