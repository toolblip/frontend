import { describe,it,expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import XLSX from 'xlsx';
import { PDFDocument } from 'pdf-lib';
import { documentPdf } from './document';
import { assertXlsx, allocateCents } from './core';
import { createZip } from '@/components/tools/CreateZipFileClient';
import { evaluateFormula } from '@/components/tools/WhatIfScenarioCalculatorClient';
import { buildStandaloneHtml } from '@/components/tools/SlideshowGeneratorClient';
import { parseClockTime, parseDuration } from '@/components/tools/TimeDurationCalculatorClient';
import { parseTimeInput } from '@/components/tools/TimestampDiffCalculatorClient';
import { randomFractionInRange, parseRangeValue } from '@/components/tools/RandomFractionGeneratorClient';
import { buildOutput } from '@/components/tools/PollGeneratorClientV2';
describe('utility-design exported formats and regressions',()=>{
 it('ZIP can be read by an independent library, including UTF-8 filenames and zero bytes',async()=>{
   const source=new Uint8Array([0,1,255,13,10]);
   const blob=createZip([{name:'café.bin',data:source},{name:'empty.txt',data:new Uint8Array()}]);
   const bytes=Buffer.from(await blob.arrayBuffer());
   const result=spawnSync('python3',['-c','import sys,zipfile,io,json; z=zipfile.ZipFile(io.BytesIO(sys.stdin.buffer.read())); print(json.dumps({n:list(z.read(n)) for n in z.namelist()}))'],{input:bytes});
   expect(result.status,result.stderr.toString()).toBe(0);
   expect(JSON.parse(result.stdout.toString())).toEqual({'café.bin':[0,1,255,13,10],'empty.txt':[]});
   expect(bytes.readUInt16LE(6)&0x800).toBe(0x800);
 });
 it('XLSX gate rejects text and ordinary ZIPs, accepts a real workbook',async()=>{
   expect(()=>assertXlsx(new TextEncoder().encode('not excel').buffer)).toThrow();
   expect(()=>assertXlsx(new ArrayBuffer(0))).toThrow();
   const zip=await createZip([{name:'test.txt',data:new Uint8Array([1])}]).arrayBuffer();expect(()=>assertXlsx(zip)).toThrow(/does not contain/);
   const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet([['Name','Value'],['Ada',3.5]]),'Data');
   const bytes=XLSX.write(wb,{type:'array',bookType:'xlsx'});expect(()=>assertXlsx(bytes)).not.toThrow();
 });
 it('PDF is paginated, parseable, and rejects unsupported characters instead of losing them',async()=>{
   const bytes=await documentPdf(('VeryLongWord'.repeat(80)+'\n').repeat(30));const pdf=await PDFDocument.load(bytes);expect(pdf.getPageCount()).toBeGreaterThan(1);
   await expect(documentPdf('বাংলা')).rejects.toThrow(/Download TXT/);
   await expect(documentPdf('')).rejects.toThrow();
 });
 it('arithmetic precedence, fractional literals and unsafe expressions',()=>{
   expect(evaluateFormula('-2^2',{})).toBe(-4);expect(evaluateFormula('2^-2',{})).toBe(.25);expect(evaluateFormula('2^3^2',{})).toBe(512);
   expect(evaluateFormula('.5 + 1.',{})).toBe(1.5);expect(evaluateFormula('price * quantity',{price:40,quantity:500})).toBe(20000);
   expect(()=>evaluateFormula('1/0',{})).toThrow(/zero/);expect(()=>evaluateFormula('constructor',{})).toThrow(/Unknown/);expect(()=>evaluateFormula('alert(1)',{})).toThrow();
 });
 it('duration parsing distinguishes duration from clock time',()=>{
   expect(parseDuration('30:00:00')).toBe(108000);expect(parseClockTime('30:00:00')).toBeNull();expect(parseClockTime('23:59:59')).toBe(86399);expect(parseDuration('1:60:00')).toBeNull();
 });
 it('timestamp offsets measure elapsed time across spring DST',()=>{
   expect(parseTimeInput('2024-03-10T03:30:00-04:00')!.ms-parseTimeInput('2024-03-10T01:30:00-05:00')!.ms).toBe(3600000);
   expect(parseTimeInput('99999999999999999999')).toBeNull();
 });
 it('fraction generation rejects impossible narrow ranges instead of returning outside them',()=>{
   expect(parseRangeValue('1/0')).toBeNull();expect(parseRangeValue('2 1/2')).toBe(2.5);
   for(let i=0;i<100;i++){const f=randomFractionInRange(.5,5/6);expect(f.numerator/f.denominator).toBeGreaterThanOrEqual(.5);expect(f.numerator/f.denominator).toBeLessThanOrEqual(5/6);}
   expect(()=>randomFractionInRange(.123456789,.12345679)).toThrow();
 });
 it('cent shares sum to the rounded total',()=>{
   expect(allocateCents([10/3,10/3,10/3])).toEqual([3.34,3.33,3.33]);expect(allocateCents([40.96,23.04])).toEqual([40.96,23.04]);
 });
 it('survey does not replace user options with invented ratings',()=>{
   const out=buildOutput('Choose | Apple | Pear | Plum','survey');expect(out).toContain('1. Apple');expect(out).toContain('3. Plum');expect(out).not.toContain('Strongly disagree');
 });
 it('HTML slideshow escapes supplied content and has navigation',()=>{
   const out=buildStandaloneHtml([{id:1,title:'<script>alert(1)</script>',body:'A & B\nnext',bgColor:'#000000'}]);expect(out).toContain('&lt;script&gt;');expect(out).not.toContain('<script>alert(1)</script>');expect(out).toContain('A &amp; B<br>next');expect(out).toContain('show(current + 1)');
 });
});
