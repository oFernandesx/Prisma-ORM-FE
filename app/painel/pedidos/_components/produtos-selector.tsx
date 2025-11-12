'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'

interface ProdutosSelectorProps {
  produtos: Array<{
    id: string
    nome: string
    preco: number
    categoria: {
      nome: string
    }
  }>
  selecionados: Array<{
    produtoId: string
    quantidade: number
  }>
  onChange: (selecionados: Array<{ produtoId: string; quantidade: number }>) => void
  disabled?: boolean
}

export default function ProdutosSelector({
  produtos,
  selecionados,
  onChange,
  disabled,
}: ProdutosSelectorProps) {
  const [aberto, setAberto] = useState(false)

  function adicionarProduto(produtoId: string) {
    const existe = selecionados.find((p) => p.produtoId === produtoId)

    if (existe) {
      onChange(
        selecionados.map((p) =>
          p.produtoId === produtoId ? { ...p, quantidade: p.quantidade + 1 } : p
        )
      )
    } else {
      onChange([...selecionados, { produtoId, quantidade: 1 }])
    }
  }

  function removerProduto(produtoId: string) {
    onChange(selecionados.filter((p) => p.produtoId !== produtoId))
  }

  function atualizarQuantidade(produtoId: string, quantidade: number) {
    if (quantidade <= 0) {
      removerProduto(produtoId)
    } else {
      onChange(
        selecionados.map((p) =>
          p.produtoId === produtoId ? { ...p, quantidade } : p
        )
      )
    }
  }

  const produtosSelecionadosInfo = selecionados.map((p) => {
    const produto = produtos.find((pr) => pr.id === p.produtoId)
    return { ...p, produto }
  })

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        onClick={() => setAberto(!aberto)}
        disabled={disabled}
        className="w-full justify-start text-left"
      >
        {selecionados.length === 0
          ? 'Selecione produtos'
          : `${selecionados.length} produto(s) selecionado(s)`}
      </Button>

      {aberto && (
        <div className="border rounded-lg p-3 space-y-2 bg-muted/30 max-h-40 overflow-y-auto">
          {produtos.map((produto) => (
            <div key={produto.id} className="flex items-center justify-between p-2 hover:bg-muted rounded">
              <div className="flex-1">
                <p className="text-sm font-medium">{produto.nome}</p>
                <p className="text-xs text-muted-foreground">{produto.categoria.nome}</p>
                <p className="text-sm text-green-600 font-semibold">R$ {produto.preco.toFixed(2)}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => adicionarProduto(produto.id)}
                disabled={disabled}
              >
                Adicionar
              </Button>
            </div>
          ))}
        </div>
      )}

      {selecionados.length > 0 && (
        <div className="border rounded-lg p-3 space-y-2 bg-muted/30">
          <p className="text-sm font-semibold">Produtos Selecionados:</p>
          {produtosSelecionadosInfo.map((item) => (
            <div
              key={item.produtoId}
              className="flex items-center justify-between p-2 bg-background rounded border"
            >
              <div className="flex-1">
                <p className="text-sm font-medium">{item.produto?.nome}</p>
                <p className="text-xs text-muted-foreground">
                  R$ {item.produto?.preco.toFixed(2)} x {item.quantidade} = R${' '}
                  {((item.produto?.preco || 0) * item.quantidade).toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="1"
                  value={item.quantidade}
                  onChange={(e) => atualizarQuantidade(item.produtoId, parseInt(e.target.value))}
                  disabled={disabled}
                  className="w-16"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removerProduto(item.produtoId)}
                  disabled={disabled}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
          <div className="pt-2 border-t">
            <p className="text-sm font-semibold text-right">
              Total: R${' '}
              {produtosSelecionadosInfo
                .reduce((acc, item) => acc + (item.produto?.preco || 0) * item.quantidade, 0)
                .toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
