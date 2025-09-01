FROM node:20

RUN curl -fsSL https://bun.sh/install | bash && \
    ln -s /root/.bun/bin/bun /usr/local/bin/bun

ENV PATH="/usr/local/bin:$PATH"

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libxkbcommon0 \
    libxcomposite1 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libcairo2 \
    libasound2 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .

RUN bun install

RUN bunx playwright install --with-deps

RUN bun add -g allure-commandline

RUN useradd -m -s /bin/bash playwright && \
    chown -R playwright:playwright /app
USER playwright

CMD ["bunx", "playwright", "test"]