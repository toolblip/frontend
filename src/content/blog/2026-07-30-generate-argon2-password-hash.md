---
title: "How to Generate Argon2 Password Hash With Right Params"
description: >-
  Learn how to generate Argon2 password hash output with the correct memory,
  time, and parallelism settings. Try the free Argon2 hash generator right now.
slug: 2026-07-30-generate-argon2-password-hash
date: "2026-07-30T00:00:00.000Z"
category: Developer Tools
tags:
  - Generate-secure-Argon2-passwor
  - SEO
  - Developer Tools
author: Toolblip Team
readingTime: 7 min
featuredImage: https://api.radtx.com/gradient/6b7280-374151/1200/630
---

# How to Generate Argon2 Password Hash With Right Params

If you want to generate Argon2 password hash output for an auth system, the hash itself is the easy part. Picking the memory, time, and parallelism values is the decision that actually determines whether your hashes resist cracking, and the defaults shipped by some libraries are weaker than current guidance recommends.

Argon2 won the Password Hashing Competition in 2015 and RFC 9106 now specifies it. Getting the parameters wrong turns a modern algorithm into something no better than what it replaced.

## What Argon2 Password Hashing Actually Does

Argon2 is a deliberately expensive key derivation function. Feeding it a password and a salt produces a fixed-length digest, and the cost of computing that digest is tunable.

The property that matters is memory hardness. Argon2 fills a large block of memory during computation and reads back from it in a pattern that cannot be shortcut, which means an attacker cannot trade memory for speed.

That constraint is what hurts specialized cracking hardware. A GPU has thousands of cores but limited memory per core, so an algorithm demanding 64 MiB per hash reduces how many hashes that GPU can compute in parallel. The memory requirement, not the raw arithmetic, becomes the bottleneck.

An Argon2 hash arrives as a single self-describing string:

```
$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHR2YWx1ZQ$RdescudvJCsgt3ub+b+dWRWJTmaaJObG
```

That string embeds every parameter needed to verify it. The variant is `argon2id`, the version is 19, memory is 65536 KiB, iterations are 3, parallelism is 4, then the base64 salt and the base64 digest.

Verification reads those values back out of the stored hash rather than from your config. Changing your parameters later does not break existing logins, because each old hash still carries the settings it was created with.

## Argon2id vs Argon2i vs Argon2d

Three variants exist and they differ in how they access memory.

Argon2d uses data-dependent memory access, which gives the strongest resistance to GPU cracking but leaks timing information through side channels. Appropriate for cryptocurrency proof of work, not for password hashing on a shared server.

Argon2i uses data-independent access, so its memory access pattern reveals nothing about the password. Side-channel safe, but weaker against certain time-memory tradeoff attacks.

Argon2id runs Argon2i for the first half pass and Argon2d thereafter, capturing side-channel resistance and GPU resistance together.

Use Argon2id. RFC 9106 names it the primary recommendation, and unless you have a specific documented reason to pick another variant, it is the correct default for password storage.

## How to Generate Argon2 Password Hash Output With Correct Settings

Three parameters control cost, and they trade off against each other.

Memory cost, written as `m`, sets how much memory in KiB the function fills. Raising it is the single most effective change, since memory is what actually constrains attacker hardware.

Time cost is the `t` parameter, the number of passes made over that memory. Raising it increases work linearly without touching the memory footprint.

Parallelism, `p`, controls how many lanes compute at once. Match it to the cores you can spare per hash operation, commonly 1 to 4 on a web server.

Two configurations from RFC 9106 are worth knowing as anchors:

```
// RFC 9106 first recommended option (high memory)
m = 2097152   // 2 GiB
t = 1
p = 4

// RFC 9106 second recommended option (lower memory)
m = 65536     // 64 MiB
t = 3
p = 4
```

The 2 GiB option is impractical for a web server handling concurrent logins, since ten simultaneous signins would demand 20 GiB. The 64 MiB option is the realistic starting point for most applications.

OWASP sets a lower floor at `m=19456` (19 MiB), `t=2`, `p=1` for constrained environments. Treat that as a minimum rather than a target.

The practical way to choose is to measure. Pick a target duration for a single hash, commonly 250 to 500 milliseconds on your production hardware, then raise memory until you hit it:

```js
// Tune on hardware matching production, not your laptop
async function findMemoryCost(hashFn, targetMs = 350) {
  for (const m of [19456, 32768, 47104, 65536, 98304, 131072]) {
    const start = performance.now();
    await hashFn('benchmark-password', { memoryCost: m, timeCost: 3, parallelism: 4 });
    const elapsed = performance.now() - start;
    console.log(`m=${m} KiB took ${elapsed.toFixed(0)}ms`);
    if (elapsed >= targetMs) return m;
  }
}
```

A laptop benchmark misleads you in both directions. A fast development machine suggests parameters your server cannot sustain, and a slow one leaves you weaker than your hardware allows.

## Argon2 vs Bcrypt Password Hashing

Bcrypt is still acceptable for password storage, so this is not a case of one option being broken.

Memory usage is the real difference. Bcrypt uses roughly 4 KiB regardless of its cost factor, and only the iteration count scales. Argon2 scales memory directly, which is the dimension that makes purpose-built cracking hardware expensive.

Password length handling differs too. Bcrypt truncates input at 72 bytes, silently ignoring everything past that, so two long passphrases sharing a 72-byte prefix produce identical hashes. Argon2 has no such limit.

Tuning granularity favors Argon2. Bcrypt gives you one dial, the cost factor, which doubles work per increment. Argon2 gives you three, letting you spend your budget on memory rather than only on time.

Bcrypt's advantage is maturity and ubiquity. It has been deployed and attacked since 1999, and every language has a well-tested binding.

If you are choosing today, pick Argon2id. If you already run bcrypt at a sensible cost factor, migrating is worthwhile but not urgent, and you can rehash opportunistically as users log in. The [Bcrypt Hash Generator](https://toolblip.com/tools/bcrypt-hash-generator) is useful for producing comparison hashes while you evaluate the switch.

## Using the Best Argon2 Hash Generator Online

Testing parameter combinations by writing a script each time is slower than adjusting values in a form and reading the result.

The [Argon2 Hash Generator](https://toolblip.com/tools/argon2-hash-generator) produces Argon2 password hashes with configurable memory, time, and parallelism. Enter a password, set the three parameters, and read back the full encoded hash.

Everything runs in the browser. To confirm that instead of trusting the claim, open DevTools, switch to the Network tab, clear the existing requests, then enter a password and generate. No request appears.

That property matters here more than for most tools. A password sent to a hashing endpoint travels the network in plaintext and probably lands in a request log, which defeats the point of hashing it carefully.

If you inherit a hash and cannot tell what produced it, the [Hash Identifier](https://toolblip.com/tools/hash-identifier) reads the prefix and format to name the likely algorithm. Useful when auditing a legacy database before planning a migration.

## Wiring Argon2 Password Hashing Into Authentication

A few implementation details cause more production problems than the algorithm choice.

Salt generation should come from your library, not from you. Argon2 implementations generate a cryptographically random salt per hash and embed it in the output. Supplying your own usually means supplying a weaker one.

Store the entire encoded string in a single column, sized for at least 128 characters. Splitting the parameters into separate columns creates a migration problem the moment you change them.

Verification must use the stored hash's parameters, which every real library does automatically when you pass the full encoded string. Reading parameters from your current config instead will break every hash created under older settings.

Rehash on login when you raise your parameters. Check whether a verified hash used weaker settings than your current target, and if so, recompute it from the plaintext you already have in hand during that request.

Never hash on the client. Client-side hashing makes the hash itself the password, so an attacker with a leaked database can authenticate by replaying it directly. Browser-based generators are for testing and parameter tuning, not for production auth flows.

## Generating Argon2 Password Hashes That Hold Up

When you generate Argon2 password hash output, the algorithm choice is settled: Argon2id, per RFC 9106. The work is in the parameters.

Start from `m=65536`, `t=3`, `p=4`, then benchmark on production-equivalent hardware and raise memory until a single hash lands in the 250 to 500 millisecond range. Store the full encoded string, verify using the parameters embedded in it, and rehash opportunistically when you raise your floor.

Test your parameter combinations in the [Argon2 Hash Generator](https://toolblip.com/tools/argon2-hash-generator) before committing them to your auth config, and see the encoded output your backend will need to parse.

