---
title: '质量保障'
date: '2023-05-12'
author:
  name: LiuuY
---

> 本文是我一本没有写完的书（《大规模 DevOps 实践：高效 DevOps 体系构建与实践》）其中的一章节

一款产品设计的再精妙、再能满足用户需求痛点，如果质量问题频发，就如同沙上建塔，一方面，产品的功能因为存在缺陷，影响用户使用，难以给用户带来价值，给了竞争对手机会；另一方，质量问题甚至会导致整个产品的失败，例如备受期待的游戏《赛博朋克 2077》，从公布到发布经历了 8 年的时间，但是发布后，其画面与流畅度表现以大量的故障也受到玩家的大量抨击，导致各个平台都宣布了无条件退款机制，并将游戏下架。

作为 DevOps 基石的质量保障就是指：以质量内建为核心，以完整的测试策略为手段，在软件整个生命周期的各个阶段，都做好缺陷预防，把对于质量的要求融入其中。

本章我们首先介绍什么是质量内建，然后通过回答“何人在何时做何种类型的测试”来梳理出一套内建质量的测试策略。最后介绍和使用质量成熟度模型来帮助我们度量成果，并分析下一步需要获得哪些能力以更好的做到质量保障。

## 质量内建

在日常的产品开发中，很少会有人把质量作为需求明确提出来，产品质量高似乎是理所应当，而且产品的质量只交由专门的测试人员把控，在瀑布开发模式下，经过一个阶段的开发后，产品再交由测试部门统一进行测试，缺陷集中反馈，开发部门再进行修复。缺陷反馈时间长，可能当前测试的版本的功能缺陷，在下一个版本中已经被修复，甚至功能已经因为各种原因被砍掉，这就导致测试资源的浪费，而且修复难度随着产品和技术复杂度的提升而提升。另一方面，经过了测试人员的测试，就万事大吉，后续产品到达用户手中之后暴露的缺陷问题缺乏监控手段，那些真正影响使用的问题，并没有得到重视。

而质量内建的观点是：质量不是测试出来的，质量是如同产品需求一样，是整个团队有计划的建立起来的；在开发阶段避免缺陷的产生胜于后续解决缺陷带来的成本，对产品全生命周期的质量进行保障。

质量内建强调：

1. 团队合作，质量由团队整体负责，而不仅仅是测试人员的责任。团队中甚至可以没有专门的测试人员，每个成员都承担起相应的质量保障工作。同时注重面对面高效沟通协作，减少缺陷修复成本。
2. 持续测试，有别于传统的具有阶段性的测试流程（例如，瀑布模型中的测试规划，测试设计，测试执行等），质量内建更加注重持续的测试包括**测试左移**、**测试右移**和**不断的质量反馈**。

### 团队合作

软件质量的保证不是其他团队的工作，也不是部分人的工作，而是所有相关角色的共同工作。很多组织受限于组织架构约束，测试人员统一划归在一个测试部门中，无法很好的参与到团队日常开发中，我们推荐将测试人员分散到不同的项目中，参与到日常开发流程中（见后文测试左移），同时其他角色从自身职责出发可以对质量做出不同的贡献。例如，需求分析人员可以在拆分任务时做到“INVEST 原则”，提升需求质量；开发人员可以参与到自动化测试的构建中，降低回归测试成本。

### 测试左移

《Applied Software Measurement》提到过：大部分缺陷都是早期引入的，同时大部分缺陷都是中晚期发现的，而缺陷发现的越晚，其修复成本就越高。因此也就有了“早测多测”（Test Early, Test Often）的说法。

测试活动通常都是在功能完成后再进行，例如上文提到的瀑布测试流程：经过一个阶段的开发后，产品再交由测试部门统一进行测试，缺陷集中反馈，开发部门再进行修复，这就导致：

- 测试人员对需求不了解，导致测试资源准备不充分。
- 测试人员无法及时发现需求、软件架构设计中的缺陷，导致开发人员返工、资源浪费等。
- 系统随着开发时间增长而越来越复杂，导致修复缺陷的成本提高。
- 由于缺陷发现晚，导致修复时间不足，只能延后修复，带来技术债。

为了解决以上问题，我们就需要将测试提前，即测试左移（"左"指的就是按照开发时序从左到右，从需求到上线）：

1. 测试人员参与到需求讨论和技术可行性论证中，在业务流程或技术方案中有较大质量风险的时候，测试人员有责任提出质疑，并给出建议，把已知的问题在讨论阶段都消灭掉。
2. 在对于需求和技术方案有了深入了解后，测试人员就可以有针对性的进行测试规划、测试资源评估等。
3. 对于具体的业务需求，测试人员需要验证需求是否有效，包括需求价值确认，需求涉及场景是否完备，与现有业务逻辑是否有冲突。同时也要考虑非功能需求（例如：性能、体验等），明确需求的范围、验收标准、测试方式等。
4. 测试人员参与到需求验收中，补充业务验收标准、回归测试等。同时也要及时沟通需求变化，有针对性的修改测试方案。

测试左移也并不单单指的是测试人员尽早进行测试活动。团队里的每个成员，也都需要有测试左移的思想，要从一开始就绷紧质量这根弦，确保每个人的工件质量。

同时测试人员要赋能开发人员，及时的提供测试环境、自动化测试工具、测试数据、测试用例等等，甚至是参与到 Code Review 过程中。

综上所述，测试左移的目标是：在早期就预防缺陷的产生，始终关注产品质量，而不是在后期找到更多的缺陷，用更高的成本修复。

### 快速反馈

快速反馈是指在整个软件生命周期的各个阶段都持续进行测试活动，以快速反馈问题，减少修复成本。它包括对持续功能测试、性能、安全测试，形式可以是静态分析、评审，也可以是动态的测试，包括手动执行的各种测试，以及持续集成流水线上的持续执行的自动化测试。

### 测试右移

在产品部署上线之后，测试人员也需要对于生成环境进行质量保障的相关工作，这种工作也称为测试右移（"右"指的就是按照开发时序从左到右，从需求到上线）。这将测试的工作范围扩大到产品环境，增加了更多的反馈来源，跟持续交付结合，可以帮助持续提高产品质量、持续优化业务价值。

## 测试策略

为了保障质量，我们需要一套策略，它应该回答：

- 什么角色来做，即明确职责
- 做什么测试，即测试类型
- 什么时候做，即测试时机

### 角色及其职责

质量内建的重要要求就是团队合作，每个角色都承担起质量保障的责任，参与到测试之中，下面列出角色、职责以及需要参与的测试。

| **角色**           | **职责**                                                                                                                                                                                                                                        | **需要参与的测试**                                                                                                          |
| :----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 产品、业务分析人员 | - 与测试人员合作制定测试计划<br />- 创建并执行测试用例<br />- 审查测试人员准备的系统案例 <br />- 在测试人员要求时提供需求说明                                                                                                                   | - 用户故事测试<br />- 用户验收测试<br />- 端到端测试<br />- 回归测试<br />- A/B 测试                                        |
| 开发人员           | - 编写自动化测试 <br />- 配合测试人员完善测试用例 <br />- 和测试人员共同制定团队级测试策略                                                                                                                                                      | - 单元测试<br />- 集成测试<br />- UI 测试<br />- 端到端测试<br />- 性能测试<br />- 混沌测试<br />- 突变测试<br />- 兼容测试 |
| 测试人员           | - 和开发人员共同制定团队级测试策略 <br />- 编写测试用例 <br />- 协助团队对用户故事的需求提供输入<br />- 协助开发人员与业务分析人员验卡 <br />- 执行手工测试 <br />- 使用自动化工具执行非功能测试 <br />- 对缺陷管理<br />- 对生产问题分析与追踪 | - 端到端测试<br />- 用户故事测试<br />- 探索性测试<br />- 用户验收测试<br />- 回归测试<br />- 兼容测试<br />- 性能测试      |

### 测试类型

在测试类型上，通常使用测试四象限进行分类，以更好的选择合适的测试类型。测试四象限的左右两侧指的是测试的作用，分别为支持团队和评价产品，而上下两部分指的是测试面向的对象，分别为面向业务和面向技术。

<img width="781" src="/assets/images/quality-assurance/ch06-02.png">

- **第一象限**是面向技术的支持团队的测试，帮助构建产品的内部质量，也就是代码质量的保障，比如单元测试和集成测试等。

- **第二象限**则是面向业务的支持团队的测试，从更高层次以业务专家可以理解的方式确定系统期望的行为，帮助团队澄清业务以更好的理解真正的业务价值。

- **第三象限**是面向业务的评价产品的测试，通过模仿真实用户使用应用的方式，帮助确认是否构建了真正需要的产品。

- **第四象限**是面向技术评价产品的测试，主要采用工具和相应的技术来评价产品的性能、兼容性和安全性等非功能特性，并且在开发周期的每一步都要考虑开展这些测试。

同时针对于不同的测试类型，可以将其分为可以自动化完成、使用工具完成、手动完成：

| **类型**     | **说明**                                                                                                                                                                                                                                                                                                                      | 实施方式 |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 单元测试     | 单元测试，指的是对代码实现意图的测试，该测试不会超出代码间逻辑调用的边界。                                                                                                                                                                                                                                                    | 自动     |
| 集成测试     | 集成测试，指的是对多个软件模块或组件进行集成关系验证的测试。该类测试的目的是为了补充单元测试难以验证的非代码间逻辑调用的行为，同时也可弥补部分单元测试之间因相互隔离而自然形成的“测试间隙”。                                                                                                                                  | 自动     |
| 端到端测试   | 端到端测试，指的是在整个软件系统级别，对基于 UI 操作或 API 调用的端到端行为进行的验证。                                                                                                                                                                                                                                       | 自动     |
| UI 测试      | UI 测试指的是对 Web 页面、移动应用界面、桌面应用界面、以及嵌入式设备的图形界面等进行的 GUI 对比测试                                                                                                                                                                                                                           | 自动     |
| 回归测试     | 回归测试是指重新运行各种测试，以确保先前开发和测试的软件在更改后仍能运行。以确保系统某个部分的微小变化，不会破坏系统中的现有功能。                                                                                                                                                                                            | 自动     |
| 突变测试     | 突变测试是将错误（或突变）自动嵌入到代码中，然后运行测试。如果测试失败，则意味着突变被杀死；而测试如果能正常通过，则说明突变存活。                                                                                                                                                                                            | 自动     |
| 兼容测试     | 兼容性测试是属于非功能测试类别的软件测试，它是在应用程序上执行以检查其在不同平台/环境下的兼容性（运行能力），如不同的软件、硬件平台、网络和浏览器等。                                                                                                                                                                         | 工具     |
| 安全测试     | 安全测试是一种证明应用程序满足其涉众的安全性要求的操作，主要包含渗透测试、安全扫描、漏洞扫描，典型的安全要求可能包括机密性、完整性、身份验证、可用性、授权和不可否认性等特定元素。 实际测试的安全需求取决于系统实现的安全需求。                                                                                               | 工具     |
| 性能测试     | 性能测试主要包含负载测试、压力测试，它用于确定系统在特定工作负载下的响应能力和稳定性方面的表现。 它还可以用于调查、测量、验证或验证系统的其他质量属性，例如可扩展性、可靠性和资源使用。                                                                                                                                       | 工具     |
| 用户验收测试 | 用户验收测试是在软件开发开发结束后，在模拟的环境下，验证软件解决方案是否符合用户。该测试是由相关的专家进行，解决方案的所有者或客户，并提供结果摘要以供在试用或审查后进行确认。                                                                                                                                                | 手动     |
| 用户故事测试 | 用户故事测试是黑盒测试的一种，它是基于敏捷实践中用户故事实践，针对客户的验收条件（Acceptance Criteria）的手工测试类型，是测试人员通过方法分析编写测试用例对用户故事的测试技术。                                                                                                                                               | 手动     |
| 探索性测试   | 探索性测试是一种试图找出软件的实际工作情况，并询问它将如何处理困难和容易的情况的测试技术。测试的质量取决于测试人员发明测试案例和发现缺陷的技能。测试人员对产品和不同的测试方法了解得越多，测试的效果就越好。常见的方式如：基于对历史问题总结、通过启发式列表、对列表中每一项在固定时间（timebox）内结合测试人员直觉进行测试。 | 手动     |
| A/B 测试     | A/B 测试是一种用户体验研究方法。A/B 测试通过对比只有一个变量不同的同一产品的两个不同版本的表现，来研究该变量的作用以及影响。                                                                                                                                                                                                  | 手动     |
| 混沌测试     | 混沌测试是混沌工程的一个子集，是在分布式系统上提升技术架构能力的高度规范的方法。通过在给定环境中的故障导致意外停机或负面用户体验之前，主动模拟和识别故障来测试系统的完整性。                                                                                                                                                  | 手动     |
| 可用性测试   | 选取有代表性的用户使用产品，观察记录用户操作时的反应和反馈，用来判断产品的可用性、易用性。                                                                                                                                                                                                                                    | 手动     |

#### 手动测试

质量保障注重的持续测试（包括测试左移、测试右移和不断的质量反馈），都十分依赖自动化测试所带来的的速度效率提升，但是也不能忽略手动测试。

手动测试一方面是做为自动化测试的重要补充，覆盖到自动化测试还未覆盖到的测试用例。

另一方面是指那些能极大的扩展测试场景、发掘新的用户需求，需要人工判断甚至是直觉的测试，例如可用性测试和探索性测试等。

因为参与自动化测试的人员也是人，也有犯错的时候，也会有认知的局限性，如果缺乏手动类型的测试，测试用例评价产品的能力也将受限，无法真实而全面的反应产品质量。

例如探索性测试，它不需要测试用例，而是测试者独立“探索”被测软件，以发现产品、甚至是测试本身的缺陷与改进意见。实施探索性测试可以再测试阶段前期，此时自动化测试并不完善，可以借由探索性测试来协助测试；也可以在测试的中后期，可以探索更多软件的可能性与找出潜藏的缺陷，也可以对原本的测试用例进行改善与评估。

#### 工具测试

很多测试可以借助工具完成。

| 测试类型 | 范围                                                 | 工具                                                                                                                                                                                             |
| :------- | :--------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 安全性   | 1. 逻辑漏洞。<br />2. 漏洞注入。 <br />3. 网络安全。 | 1. 静态分析安全测试（SAST）：Lint、SonarQube、代码卫士<br />2. 依赖扫描（SCA）：OWASP DC、开源卫士<br />3. 动态应用安全测试（DAST）：OWASP ZAP<br />4. 交互式应用安全测试（IAST）：OpenRASP-IAST |
| 稳定性   | 1. 可靠性测试。<br />2. 压力测试。 <br />            | 1. 混沌测试：AWS Fault Injection Simulator<br />2. 压测工具：Apache JMeter                                                                                                                       |
| 兼容性   | 1. 手机兼容性<br />2. 浏览器兼容性                   | 1. 手机兼容性测试：WeTest<br />2. 浏览器兼容性测试：QA Wolf、Cypress                                                                                                                             |

#### 自动化测试策略

质量保障无法离开自动化测试：

- 时间限制：为了做到快速反馈，需要快速的执行测试用例。
- 人力限制：如上面所说质量保障不仅仅包括执行测试用例，还需要测试人员广泛的参与到整个软件开发生命周期中，这就需要有充分的人力投入。
- 稳定性限制：手动测试依赖人的执行，易出错。

为了提高和改进自动化测试的质量，我们首先按照覆盖率、集成度等将不同类型的自动化测试分层，然后从业务和易测试性两个角度给出自动化测试的评估策略和改进方向。

##### 自动化测试分层模型

测试分层是为了通过为系统建立不同抽象层次的自动化测试。

下图是对于常见的 8 种测试分层模型的总结：

<img width="781" src="/assets/images/quality-assurance/ch06-01.png">

其元模型如下：

1. **宽度**代表自动化测试覆盖率，即表示软件程式中被自动化测试到的比例，常见的如行覆盖率。
2. **高度**代表测试的粒度，越高越接近业务逻辑，越低越接近代码逻辑。
3. **形态**可以用于表示测试质量的稳定性。如三角形具备很好的质量稳定性，即通过提高单元测试，可以提升系统的质量；而倒三角形在稳定性上比较差，显示系统当前的质量存在一定的问题。

##### 自动化测试策略评估

自动化测试策略主要从面向技术和业务概念完整性两个维度来考虑（见上图）。根据对上述两个不同的维度，选择合适的不同测试策略，参考 Thoughtworks 的王瑞鹏构建的自动化测试策略评估模型：

| 架构易测试性 | 描述                                                   | 权重 |
| ------------ | ------------------------------------------------------ | ---- |
| 技术栈可测性 | 项目所使用的技术栈是否易于搭建测试环境，是否易于测试。 | 35%  |
| 环境提供难度 | 运行接口层/UI 层自动化测试提供稳定环境难度。           | 25%  |
| 架构层次     | 是否有明确的架构分层策略，分层的深度是否合理。         | 20%  |
| 架构耦合度   | 服务间、代码间的耦合情况，以及扇入和扇出情况。         | 20%  |

<br>

| 业务概念完整性 | 描述                                                                                           | 权重 |
| -------------- | ---------------------------------------------------------------------------------------------- | ---- |
| 需求描述准确性 | 需求从产品需求端，到开发测试端的澄清有没有遗漏。                                               | 35%  |
| 业务数据简洁度 | 是否创建数据的过程复杂（体现业务复杂）、数据本身的关系复杂。                                   | 35%  |
| 系统概念完整率 | 各个角色是否能在一起能完整地描述整个系统的功能和模型（需要考虑人员流动程度、系统年限等因素）。 | 20%  |
| 业务文档化程度 | 是否能有序地从文档中推出现有的业务知识。                                                       | 5%   |

可根据下表填写：

| 影响因子       | 评分 （0 - 5） | 说明 （每个影响因子对应的现状说明） |
| -------------- | -------------- | ----------------------------------- |
| 技术栈可测性   |                |                                     |
| 环境提供难度   |                |                                     |
| 架构层次       |                |                                     |
| 架构耦合度     |                |                                     |
| 需求描述准确性 |                |                                     |
| 业务数据简洁度 |                |                                     |
| 系统概念完整率 |                |                                     |
| 业务文档化程度 |                |                                     |

##### 演进示例

某团队自动化测试分层策略实例化示例：

| 影响因子       | 评分（0-5） | 说明（每个影响因子对应的现状说明）                                                              |
| -------------- | :---------- | ----------------------------------------------------------------------------------------------- |
| 技术栈可测性   | 5           | 团队目前使用 React 框架，技术栈具备充分可测性。                                                 |
| 环境提供难度   | 2           | 环境准备依赖手工，环境不稳定，具备部分可测性。                                                  |
| 架构层次       | 2           | 架构设计较扁平，抽象层级较低，存在组件多用途复用情况，架构分层不明确。                          |
| 架构耦合度     | 2           | 当前代码 UI、业务耦合度高，代码逻辑添加单元测试成本较高，需要对代码进行重构后才能添加单元测试。 |
| **得分**       | **3.05**    |                                                                                                 |
| 需求描述准确性 | 2           | 需求描述不准确，具体情况依赖开发人员判断细化。                                                  |
| 业务数据简洁度 | 3           | 业务流程相对简单，但是数据来源广，依赖多个三方系统。                                            |
| 系统概念完整率 | 2           | 业务完整率较低，多角色单独沟通，信息概念传递链路长。                                            |
| 业务文档化程度 | 4           | 文档化程度高，知识内容统一管理。                                                                |
| **得分**       | **2.35**    |                                                                                                 |

演进方向：

<img width="781" src="/assets/images/quality-assurance/ch06-03.png">

##### 自动化测试度量指标

下面列出一些用于评估自动化测试的常见指标，测试包括单元测试、集成测试和 UI 测试：

| 度量指标       | 定义                       | 解释                                                   | 计算方法                                                                            |
| -------------- | -------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| 平均测试通过率 | 测试成功运行通过占比       | 自动化测试通过率过低，可能说明了测试代码或者设计有问题 | 时间内通过用例数 ÷ 用例总数 × 100%                                                  |
| 平均测试耗时   | 测试时长                   | 测试时间过长会影响开发效率，例如影响流水线部署频率     | 时间内单元测试耗时 ÷ 单元测试运行次数                                               |
| 测试行覆盖率   | 测试覆盖行数/接口/功能占比 | 常见的行覆盖率、分支覆盖率以及 UI 测试到的功能数       | 行覆盖率、分支覆盖率<br />集成测试用例的接口数 ÷ 接口数<br />UI 测试功能数 ÷ 功能数 |

### 测试时机

从需求分析到上线，如此迭代，每个阶段都有不同的测试实践。

<img width="781" src="/assets/images/quality-assurance/ch06-04.png">

#### 故事卡层面

在每个迭代周期中，测试实践都围绕故事卡进行。

##### 故事启动

在质量保障的实践中，测试人员需要在开发人员领取一张故事卡的时候就参与其中，包括：需求澄清、明确影响范围和对齐验收标准。这些实践的核心是要求测试人员、业务人员以及开发人员交流和配合，一起来澄清所有对于需求的疑问、疑虑，并确认所有的验收条件，这些都是验收测试用例的重要输入。如果测试人员发现业务需求本身有问题，或者验收条件不合理、不可测等，那么测试人员就需要及时提出来，保证开发人员拿到的故事卡是业务清晰的、理解一致的，验收条件合理并可测。例如需求是实现付款功能，测试人员在故事启动阶段就要明确，如何进行测试，是有模拟环境可以付款，还是必须要真金白银付款才能跑通流程，如果是的话，如何进行退款，这都影响后续测试计划的重要因素。

这些实践可以从源头减少缺陷，是测试左移的体现。

##### 故事开发

在需求开发过程中，测试人员可以：

- 关注项目进度、阻塞点以及开发进度等相关的风险，及时向开发人员、产品经理等角色反馈。
- 和开发一起实现自动化测试。

这些实践能减少缺陷进入测试阶段，减少缺陷的反馈周期，降低返工的成本，提高软件质量。同时自动化测试可以降低回归测试成本。

##### 故事验收

开发人员完成故事之后和测试人员、业务人员共同验收（Desk Check）包括：

- 验证需求是否按照要求完成。
- 快速进行验收测试（ATDD）。
- 再次和开发人员明确影响范围等，因为随着开发的进行，影响的范围可能与故事启动时预想的不同。

这些实践可以快速发现明显的缺陷，从而减少缺陷发现和修复的周期。同时业务人员如果对于实现的需求有变动，也可快速反馈，创建新的故事卡，防止在迭代后期再大面积返工。

##### 故事测试

通过故事验收以后，理论上需求是应该全部被满足了，也不应该存在明显的缺陷了。这个时候应该做更多的测试，从而发现验收条件以外的缺陷，包括：

- 执行探索性测试、安全测试等。
- 关注会阻碍故事发布的风险因素。
- 为测试发现的严重缺陷添加测试用例和自动化测试。
- 执行自动化回归测试。

通过这个环节可以尽最大可能发现所有问题，并在最后给客户演示之前评估完所有的风险，并尽最大可能防止风险会影响到客户。

#### 迭代层面

每个迭代前后都包含了相应的测试实践。

##### 测试计划

在每个迭代前，根据本迭代要做的需求测试人员需要进行：

- 估算测试工作量。
- 制定测试计划。
- 准备测试数据、测试环境。

通过这个环节可以初步估算出测试工作量，以便安排发布计划。

##### 缺陷大扫荡

缺陷大扫荡（Bug Bash）是产品版本发布前，团队全员（开发人员、测试人员、设计师等）放下手中的日常工作，集中起来体验产品寻找缺陷，一般流程是：

- 开始前需要准备需求列表、测试环境、测试设备、问题记录工具、会议室等等。
- 进行时需要大家从自己的角度使用产品，并记录下问题，包括环境、所使用的工具、缺陷截图等等。
- 结束后统一合并整理大家发现的缺陷。
- 最后将有效的缺陷依据优先级安排到后续的工作计划中。

缺陷大扫荡并不一定每个迭代都要进行，建议在积累了较多的需求，且发布之前两三天进行，这样可以保证没有重大的影响大家测试的缺陷、服务也稳定，同时也留下了几天用于修复优先级较高的缺陷。

##### 客户演示

迭代结束后，可以给客户或者产品负责人进行验收演示，包括：

- 端到端的演示本迭代完成的功能，确定是否符合预期。
- 收集各个相关方反馈，成为未来迭代的重要输入。

如果演示中出现问题，就需要进行分析，是验收条件有错误或者遗漏，还是需求故事本身有问题，还是技术侧出现了缺陷。虽然没有办法百分百避免验收演示失败这种小概念事件，但是一旦发生，我们可以通过“迭代回顾会”等手段持续改进并进一步减小其发生的概率。

#### 生产环境层面

在产品部署上线之后，测试人员也需要对于生成环境进行质量保证的相关工作，即测试右移。这将测试的工作范围扩大到产品环境，增加了更多的反馈来源，跟持续交付结合，可以帮助持续提高产品质量、持续优化业务价值。

##### 线上功能验证

线上之后，测试人员可以马上进行：

- 测试第三方生产环境服务的集成情况。
- 整体需求的线上冒烟测试。

通过这个环节保证的上线产品的基本功能完成。

##### 数据分析

产品环境中软件系统在运行过程中会产生大量的数据，通过分析这些数据，往往可以找到优化和提高软件质量的方案。例如，大量用户的网站平均加载时间、崩溃统计、使用的手机或者浏览器版本等等，这些数据都能帮助优化测试策略，加强兼容性测试等等。

同时也可以记录用户产生的真实数据（需要匿名化数据，防止用户信息泄露），用于后续的单元、集成测试中。

##### 业务功能监控

除了常见的服务监控，例如监控是否在线、响应时间等等，测试人员也需要在生产环境中监控业务功能是否正常，例如利用自动化的手段执行登录流程，已到达监控登录功能的目的，并在出问题的时候及时反馈。

## 质量成熟度模型

成熟度模型是一种工具，可以帮助人们评估一个人或一个团队当前的有效性，并分析他们下一步需要获得哪些能力以改善其绩效。

针对于质量保障的提升我们可以使用质量成熟度模型。在使用质量成熟度模型时，首先要进行评估，确定被评估者当前正在执行的等级。确定现行等级之后，便可以使用之上的等级来确定接下来的能力发展方向。

明确所需能力的优先级是使用成熟度模型的最大好处，基于这样的认知，如果处于第二级，那么获取第三级的能力要比第四级的重要很多。针对复杂领域，这样的分级认知有助于快速共识和改进计划的制定。

Martin Fowler 在 Maturity Model 一文中提出的观点是：成熟度模型评估的真正结果不是您处于什么水平，而是您需要改进的工作清单。当前的水平只是一项中间工作，以便能够确定接下来需要获得的技能列表。

质量成熟度模型并不是教条的、一成不变的，需要结合组织的实际情况进行增减，但是只要把握住质量内建的核心，能优化测试策略，相信对于组织质量保障能力的提升都是有指导意义的。

### 质量成熟度模型示例

下面给出的是一个质量成熟度模型示例。

| 维度       | 描述                                                                                                                                                                                                                                                                         |
| :--------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 团队合作   | 1. 团队不同角色共同承担测试工作，为质量提高做贡献。<br />2. 需求明确、可测试性强。<br />3. 测试覆盖率达到要求，开发人员对产品质量有信心。                                                                                                                                    |
| 测试左移   | 1. 通过早期沟通来预防缺陷，而不是在开发后通过测试发现缺陷。<br />2. 测试驱动实现，测试先行，而不是仅仅在软件实现后，依据需求文档测试。<br />3. 将测试视为整个软件开发生命周期的一部分。                                                                                      |
| 快速反馈   | 1. 为团队提供变更反馈的流程，以更快的获得质量状态（例如： CI）。<br />2. 构建流程中包含指标和度量，以促进持续改进。<br />3. 有用于提交代码变更前运行的测试集。<br />4. 尽早与相邻系统进行集成。<br />5. 不在缺陷管理工具记录正在开发内容相关的缺陷，直接跟开发人员沟通修复。 |
| 测试右移   | 1. 上线后测试持续不断的进行，并不是只在专门的测试阶段。<br />2. 线上服务监控、业务监控。<br />3. 线上缺陷管理。                                                                                                                                                              |
| 自动化测试 | 1. 自动化测试分层合理。<br />2. 自动化测试比例高，可以减少测试人员负担，快速反馈问题。<br />3. 有足够的自动化测试环境和数据，以确保可以经常执行并产生可靠的结果。                                                                                                            |
| 手动测试   | 1. 有充足的探索性测试、可用性测试，可以全面反应产品质量。<br />2. 不需要大量用来弥补自动化测试不足的手动测试。                                                                                                                                                               |
| 测试充分   | 1. 测试类型充分，包括各种测试类型。<br />2. 测试时机准确，确保各个关节都有相应的质量保证实践。                                                                                                                                                                               |

<br>

| 等级 | 描述                                                       |
| :--- | :--------------------------------------------------------- |
| 1    | 初始级：质量实践无管理，实践做法随机。                     |
| 2    | 入门级：开始有质量意识，尝试采用一些质量实践，做法较原始。 |
| 3    | 规范级：开始尝试建立规范来约束质量实践，执行效果待提高。   |
| 4    | 成熟级：有相对成熟的质量规范，实践也基本能够遵循规范。     |
| 5    | 卓越级：在原有规范的基础上团队可以针对实际情况改进。       |

### 质量成熟度模型应用

团队根据质量成熟度模型，结合团队情况进行打分，例如：

| 维度       | 现状                                                                                                                         | 等级 |
| :--------- | :--------------------------------------------------------------------------------------------------------------------------- | ---- |
| 团队合作   | 1. 开发人员没有考虑可测试性。<br />2. 业务相对明确，可测试。                                                                 | 2    |
| 测试左移   | 1. 测试介入较晚，在开发后期才根据需求文档设计测试用例。                                                                      | 2    |
| 快速反馈   | 1. 有较多的自动化测试，包括 UI 自动化测试、接口自动化测试。<br />2. 测试阶段结束后，统一提交缺陷列表给开发人员。             | 3    |
| 测试右移   | 1. 有独立的测试阶段，没有监控线上缺陷和质量。                                                                                | 1    |
| 自动化测试 | 1. 单元覆盖率 40%。<br />2. UI 测试常常因为第三方服务而执行失败。                                                            | 1    |
| 手动测试   | 1. 有可用性测试。<br />2. 手动测试较多。                                                                                     | 2    |
| 测试充分   | 1. 每个环节都有相应的测试实践，包括开发中、上线后。<br />2. 测试类型较少，多集中在业务正确性验证测试中，缺乏性能、安全测试。 | 2    |

团队可以根据打分情况，进行优化改进：

| 维度       | 改进项                                                                                                                                | 目标等级 |
| :--------- | :------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| 团队合作   | 1. 业务、开发人员在迭代尾声进行 Bug Bash。<br />2. 开发人员采用演进式架构，提高架构可测试性。                                         | 3        |
| 测试左移   | 1. 测试人员参与需求评审，关注需求质量。<br />2. 测试人员参与架构评审，关注架构可测试性。                                              | 3        |
| 快速反馈   | 1. 测试阶段发现的问题及时通过邮件或面对面的方式反馈给开发，及时修复。<br />2. 结合构建流水线进行静态代码检查。                        | 3        |
| 测试右移   | 1. 进行线上重点流程业务监控。<br />2. 上线后进行冒烟测试，确保基本功能正常。                                                          | 3        |
| 自动化测试 | 1. 开发人员提高单元测试覆盖率到 70%。<br />2. 搭建独立 UI 测试环境，对三方服务进行模拟。<br />3. 回归测试自动化，降低测试人员工作量。 | 3        |
| 手动测试   | 1. 增加探索性测试，及时发现潜缺陷。                                                                                                   | 3        |
| 测试充分   | 1. 增加性能、安全测试。                                                                                                               | 3        |

## 本章小结

质量保障以质量内建为内核，包含团队合作、测试左移、快速反馈和测试右移。

保障质量的测试策略是包含足够的测试类型，以自动化测试为重点，手动测试和工具测试为补充。同时要求全员参与，在软件生命周期的各个阶段都有相应的测试活动。

软件质量不是一蹴而就，需要我们使用质量成熟度模型，不断评估、不断改进。
