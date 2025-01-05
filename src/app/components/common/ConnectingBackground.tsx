import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const ConnectingBackground = () => {
    const router = useRouter();

    useEffect(() => {
        const canvas = document.getElementById("networkCanvas") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d");

        if (!ctx) return;

        const particles: {
            x: number;
            y: number;
            radius: number;
            velocityX: number;
            velocityY: number;
        }[] = [];

        const numParticles = 15;
        const connectionDistance = 100;

        const resizeCanvas = () => {
            const canvasWidth = canvas.width = canvas.parentElement!.offsetWidth;
            const canvasHeight = canvas.height = canvas.parentElement!.offsetHeight;

            // Reposition particles on resize
            particles.forEach((particle) => {
                particle.x = Math.min(particle.x, canvasWidth);
                particle.y = Math.min(particle.y, canvasHeight);
            });
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        for (let i = 0; i < numParticles; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: 5,
                velocityX: (Math.random() - 0.5) * 1,
                velocityY: (Math.random() - 0.5) * 1,
            });
        }

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((particle) => {
                particle.x += particle.velocityX;
                particle.y += particle.velocityY;

                if (particle.x + particle.radius > canvas.width || particle.x - particle.radius < 0) {
                    particle.velocityX = -particle.velocityX;
                }
                if (particle.y + particle.radius > canvas.height || particle.y - particle.radius < 0) {
                    particle.velocityY = -particle.velocityY;
                }

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = "#f97316";
                ctx.fill();
            });

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(255, 149, 0, ${1 - distance / connectionDistance})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
        };
    }, []);

    return (
        <div className="relative w-full h-screen bg-gray-100">
            <div className="relative z-10 text-center text-gray-700 px-4 pt-10 md:px-6">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to FriendlyHire</h1>
                <h2 className="text-2xl md:text-4xl font-bold mb-4">Connecting Talents, Building Futures</h2>
                <p className="text-lg md:text-xl mt-4">
                    Empowering connections between alumni and job seekers - FriendlyHire simplifies your journey to career success and professional growth.
                </p>
            </div>

            <div className="relative mx-auto mt-10 w-full md:w-1/2 h-64">
                <canvas id="networkCanvas" className="w-full h-full"></canvas>
            </div>

            <div className="relative z-10 flex justify-center mt-8 space-x-4 md:space-x-20">
                <button
                    className="py-2 px-4 text-white bg-orange-400 hover:bg-orange-500 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange-200"
                    onClick={() => router.push("/pages/signup")}
                >
                    Join Us →
                </button>
                <button
                    className="py-2 px-4 text-white bg-gray-700 hover:bg-gray-800 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange-200"
                    onClick={() => router.push("/pages/login")}
                >
                    Continue Your Journey →
                </button>
            </div>
        </div>
    );
};

export default ConnectingBackground;
