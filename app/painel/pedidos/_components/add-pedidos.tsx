'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState, useTransition } from 'react'
import { criarPedido } from '../actions'
import { toast } from 'sonner'
import ProdutosSelector from './produtos-selector'

interface AddPedidosProps {
  produtos: Array<{
    id: string
    nome: string
    preco: number
    categoria: {
      nome: string
    }
  }>
}

export default function AddPedidos({ produtos }: AddPedidosProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [nome, setNome] = useState('')
  const [endereco, setEndereco] = useState('')
  const [telefone, setTelefone] = useState('')
  const [produtosSelecionados, setProdutosSelecionados] = useState<
    Array<{ produtoId: string; quantidade: number }>
  >([])

  function formatarTelefone(valor: string) {
    valor = valor.replace(/\D/g, '')
    if (valor.length <= 2) {
      return valor
    }
    if (valor.length <= 6) {
      return `(${valor.slice(0, 2)}) ${valor.slice(2)}`
    }
    if (valor.length <= 10) {
      return `(${valor.slice(0, 2)}) ${valor.slice(2, 6)}-${valor.slice(6)}`
    }
    return `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7, 11)}`
  }

  async function handleSubmit() {
    if (!nome.trim()) {
      toast.error('Nome do cliente é obrigatório')
      return
    }
    if (!endereco.trim()) {
      toast.error('Endereço é obrigatório')
      return
    }
    if (!telefone || telefone.length < 14) {
      toast.error('Telefone inválido')
      return
    }

    startTransition(async () => {
      const result = await criarPedido(nome, endereco, telefone, produtosSelecionados)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Pedido criado com sucesso!')
        setOpen(false)
        setNome('')
        setEndereco('')
        setTelefone('')
        setProdutosSelecionados([])
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Novo Pedido</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Pedido</DialogTitle>
          <DialogDescription>
            Preencha os dados do cliente e selecione os produtos.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Cliente</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: João Silva"
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Input
              id="endereco"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              placeholder="Ex: Rua A, 123, Apto 401"
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              value={telefone}
              onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
              placeholder="(XX) XXXXX-XXXX ou (XX) XXXX-XXXX"
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label>Produtos</Label>
            <ProdutosSelector
              produtos={produtos}
              selecionados={produtosSelecionados}
              onChange={setProdutosSelecionados}
              disabled={isPending}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isPending || produtosSelecionados.length === 0}>
            {isPending ? 'Criando...' : 'Criar Pedido'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
